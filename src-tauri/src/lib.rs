use cull_engine::commands::{dispatch, error_json, Host};
use cull_engine::{Engine, EngineConfig, EngineError, EventSink, Result as EngineResult};
use percent_encoding::{utf8_percent_encode, AsciiSet, NON_ALPHANUMERIC};
use serde_json::Value;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use tauri::{AppHandle, Emitter, Manager, State};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_opener::OpenerExt;

const URI_COMPONENT: &AsciiSet = &NON_ALPHANUMERIC
    .remove(b'-').remove(b'_').remove(b'.').remove(b'!')
    .remove(b'~').remove(b'*').remove(b'\'').remove(b'(').remove(b')');

fn asset_url(path: &Path) -> String {
    let encoded = utf8_percent_encode(&path.to_string_lossy(), URI_COMPONENT);
    if cfg!(target_os = "windows") {
        format!("http://asset.localhost/{encoded}")
    } else {
        format!("asset://localhost/{encoded}")
    }
}

struct TauriEvents(AppHandle);
impl EventSink for TauriEvents {
    fn emit(&self, event: &str, payload: Value) {
        if let Err(error) = self.0.emit(event, payload) {
            log::warn!("Could not deliver engine event {event}: {error}");
        }
    }
}

struct TauriHost(AppHandle);
fn host_error(error: impl std::fmt::Display) -> EngineError {
    EngineError::Remote { code: "internal".into(), message: error.to_string() }
}
impl Host for TauriHost {
    fn pick_folder(&self) -> Option<PathBuf> {
        self.0.dialog().file().blocking_pick_folder().and_then(|path| path.into_path().ok())
    }
    fn reveal(&self, path: &Path) -> EngineResult<()> {
        self.0.opener().reveal_item_in_dir(path).map_err(host_error)
    }
    fn open_external(&self, url: &str) -> EngineResult<()> {
        self.0.opener().open_url(url, None::<&str>).map_err(host_error)
    }
    fn device_name(&self) -> String {
        whoami::devicename().unwrap_or_else(|_| "ShootR".to_string())
    }
    fn allow_directory(&self, directory: &Path) {
        if let Err(error) = self.0.asset_protocol_scope().allow_directory(directory, true) {
            log::warn!("Could not grant preview access to {}: {error}", directory.display());
        }
    }
}

struct AppState { engine: Arc<Engine>, host: Arc<TauriHost> }

#[tauri::command]
async fn invoke_engine(
    state: State<'_, AppState>,
    command: String,
    args: Value,
) -> Result<Value, Value> {
    let engine = state.engine.clone();
    let host = state.host.clone();
    tauri::async_runtime::spawn_blocking(move || {
        dispatch(&engine, host.as_ref(), &command, &args)
            .map_err(|error| error_json(&error))
    })
    .await
    .unwrap_or_else(|error| Err(serde_json::json!({"code":"internal","message":error.to_string()})))
}

fn model_dir(app: &AppHandle) -> PathBuf {
    if let Ok(path) = std::env::var("SHOOTR_MODELS") { return PathBuf::from(path); }
    app.path().resource_dir().map(|dir| dir.join("models"))
        .unwrap_or_else(|_| PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../models"))
}

fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let handle = app.handle().clone();
    let data_dir = handle.path().app_data_dir()?;
    let cache_dir = handle.path().app_cache_dir()?.join("previews");
    std::fs::create_dir_all(&cache_dir)?;
    handle.asset_protocol_scope().allow_directory(&cache_dir, true)?;
    let engine = Engine::open(EngineConfig {
        data_dir,
        cache_dir,
        models_dir: model_dir(&handle),
        pack_dir: None,
        url_mapper: Arc::new(asset_url),
        events: Arc::new(TauriEvents(handle.clone())),
        secrets: None,
    })?;
    app.manage(AppState { engine, host: Arc::new(TauriHost(handle)) });
    Ok(())
}

pub fn run() {
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .setup(setup)
        .invoke_handler(tauri::generate_handler![invoke_engine])
        .run(tauri::generate_context!())
        .expect("ShootR could not start");
}
