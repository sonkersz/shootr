import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import {
  Aperture, ArrowDownToLine, BadgeCheck, Check, ChevronDown, CircleHelp,
  CircleUserRound, Clock3, CloudOff, Command, Download, Eye, FileImage,
  FolderOpen, Heart, ImagePlus, Info, LayoutGrid, ListFilter, LockKeyhole,
  LogIn, MoreHorizontal, Play, Search, Settings2, ShieldAlert, Sparkles,
  Star, UserRoundCog, X, Zap,
} from "lucide-react";

type Status = "pending" | "analyzed" | "error";
type Photo = {
  id: string; fileName: string; relPath: string; thumbUrl: string | null;
  kind: string; status: Status; decision: "selected" | "toReview" | "rejected";
  assessment?: { score: number; verdict: string; reasons: string[] } | null;
  mark: { flag: string; rating: number; label: string };
  exif?: { camera: string | null; lens: string | null; iso: number | null };
};
type Project = {
  id: string; name: string; rootPath: string; photoCount: number;
  counts: { selected: number; toReview: number; rejected: number };
};
type ProjectData = { project: Project; photos: Photo[]; groups: unknown[] };
type EngineInfo = { modelsReady: boolean; noAccount: boolean; platform: string; accelerator: string };
type Page = "review" | "profile" | "users";
type Filter = "all" | "selected" | "review" | "rejected";

async function engine<T>(command: string, args: Record<string, unknown> = {}): Promise<T> {
  return invoke<T>("invoke_engine", { command, args });
}

function App() {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [engineInfo, setEngineInfo] = useState<EngineInfo | null>(null);
  const [page, setPage] = useState<Page>("review");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{ done: number; total: number; stage: string } | null>(null);
  const [error, setError] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  useEffect(() => {
    engine<EngineInfo>("app_info").then(setEngineInfo).catch(() => setEngineInfo(null));
    const off = [
      listen<{ projectId: string; photo: Photo }>("analysis-photo", ({ payload }) => {
        setProjectData(current => current?.project.id !== payload.projectId ? current : {
          ...current, photos: current.photos.map(photo => photo.id === payload.photo.id ? payload.photo : photo),
        });
      }),
      listen<{ projectId: string; done: number; total: number; stage: string }>("analysis-progress", ({ payload }) => {
        setAnalysis({ done: payload.done, total: payload.total, stage: payload.stage });
      }),
      listen<{ projectId: string }>("analysis-done", () => setAnalysis(null)),
      listen<{ projectId: string; message: string }>("analysis-error", ({ payload }) => {
        setAnalysis(null); setError(payload.message);
      }),
    ];
    return () => { void Promise.all(off).then(unsubs => unsubs.forEach(unsub => unsub())); };
  }, []);

  const photos = projectData?.photos ?? [];
  const visiblePhotos = useMemo(() => photos.filter(photo => {
    const textMatch = !query || photo.fileName.toLowerCase().includes(query.toLowerCase());
    const filterMatch = filter === "all" ||
      (filter === "selected" && photo.decision === "selected") ||
      (filter === "review" && photo.decision === "toReview") ||
      (filter === "rejected" && photo.decision === "rejected");
    return textMatch && filterMatch;
  }), [photos, query, filter]);
  const selectedPhoto = visiblePhotos.find(photo => photo.id === selectedId) ?? visiblePhotos[0] ?? null;
  const counts = projectData?.project.counts ?? { selected: 0, toReview: 0, rejected: 0 };

  async function openFolder() {
    setError(""); setLoading(true);
    try {
      const path = await engine<string | null>("pick_folder");
      if (!path) return;
      const project = await engine<Project>("open_folder", { path, recursive: true });
      const data = await engine<ProjectData>("get_project", { projectId: project.id });
      setProjectData(data); setSelectedId(data.photos[0]?.id ?? null); setFilter("all");
      if (engineInfo?.modelsReady) {
        await engine("start_analysis", { projectId: project.id });
        setAnalysis({ done: 0, total: data.photos.length, stage: "analyzing" });
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "ShootR could not open that folder.");
    } finally { setLoading(false); }
  }

  async function mark(flag: "pick" | "reject") {
    if (!selectedPhoto || !projectData) return;
    try {
      await engine("set_marks", { projectId: projectData.project.id, photoIds: [selectedPhoto.id], patch: { flag } });
      const updated = await engine<ProjectData>("get_project", { projectId: projectData.project.id });
      setProjectData(updated);
      const index = visiblePhotos.findIndex(photo => photo.id === selectedPhoto.id);
      setSelectedId(visiblePhotos[Math.min(index + 1, visiblePhotos.length - 1)]?.id ?? null);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save that rating."); }
  }

  function moveSelection(delta: number) {
    const index = visiblePhotos.findIndex(photo => photo.id === selectedPhoto?.id);
    setSelectedId(visiblePhotos[(index + delta + visiblePhotos.length) % visiblePhotos.length]?.id ?? null);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement) return;
      if (event.key === "ArrowRight") moveSelection(1);
      if (event.key === "ArrowLeft") moveSelection(-1);
      if (event.key.toLowerCase() === "p") void mark("pick");
      if (event.key.toLowerCase() === "x") void mark("reject");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <main className="shell">
      <aside className="rail">
        <div className="brand"><span className="brand-mark"><Aperture size={18} /></span><span>shootr</span></div>
        <div className="rail-rule" />
        <button className={page === "review" ? "rail-button active" : "rail-button"} title="Review workspace" onClick={() => setPage("review")}><LayoutGrid size={18} /><span>Library</span></button>
        <button className="rail-button" title="Preferences"><Settings2 size={18} /><span>Settings</span></button>
        <div className="rail-spacer" />
        <button className="rail-button" title="Account profile" onClick={() => setPage("profile")}><CircleUserRound size={18} /><span>Profile</span></button>
        <button className="rail-button" title="User management" onClick={() => setPage("users")}><UserRoundCog size={18} /><span>Users</span></button>
        <div className="rail-bottom"><span className="local-dot" />Local engine</div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="crumb"><span>Library</span><span className="slash">/</span><strong>{projectData?.project.name ?? "New session"}</strong><ChevronDown size={14} /></div>
          <div className="top-actions">
            <span className="offline-pill"><CloudOff size={13} /> On device</span>
            <button className="avatar-button" onClick={() => setAccountOpen(!accountOpen)} aria-label="Open account menu"><span>A</span><ChevronDown size={12} /></button>
            {accountOpen && <div className="account-menu"><div className="menu-title">Account</div><button onClick={() => { setPage("profile"); setAccountOpen(false); }}><CircleUserRound size={15} /> Profile & stats</button><button onClick={() => { setPage("users"); setAccountOpen(false); }}><UserRoundCog size={15} /> Manage users</button><div className="menu-foot">Identity provider not configured</div></div>}
          </div>
        </header>

        {signInOpen && <AccountDialog onClose={() => setSignInOpen(false)} />}
        {page === "review" ? (
          <>
            <div className="toolbar">
              <div className="title-block"><h1>{projectData?.project.name ?? "Your photo library"}</h1><p>{projectData ? `${projectData.project.photoCount.toLocaleString()} frames · ${projectData.project.rootPath}` : "A quieter way to find the frames worth keeping."}</p></div>
              <div className="toolbar-actions">
                <label className="searchbox"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a frame" /><kbd>⌘ K</kbd></label>
                <button className="button button-subtle" onClick={() => void openFolder()} disabled={loading}><FolderOpen size={15} />{loading ? "Opening…" : "Open folder"}</button>
                {projectData && <button className="button button-primary" disabled={!engineInfo?.modelsReady || !!analysis} title={!engineInfo?.modelsReady ? "Local culling model files are not installed yet." : undefined} onClick={() => void engine("start_analysis", { projectId: projectData.project.id }).then(() => setAnalysis({ done: 0, total: photos.length, stage: "analyzing" })).catch(e => setError(String(e)))}><Sparkles size={15} /> Cull locally</button>}
              </div>
            </div>

            {error && <div role="alert" className="error-banner"><ShieldAlert size={16} /><span>{error}</span><button aria-label="Dismiss" onClick={() => setError("")}><X size={15} /></button></div>}
            {analysis && <div className="analysis-strip"><div className="analysis-copy"><span className="pulse" /><strong>Analyzing on this device</strong><span>{analysis.done.toLocaleString()} / {analysis.total.toLocaleString()} frames</span></div><div className="progress"><span style={{ width: analysis.total ? `${Math.min(100, analysis.done / analysis.total * 100)}%` : "4%" }} /></div><span className="analysis-stage">{analysis.stage}</span></div>}

            <div className="summary-row">
              <div className="summary-label"><span className="live-square" />Cull overview</div>
              <div className="summary-stats"><span><b>{counts.selected}</b> picked</span><i /><span><b>{counts.toReview}</b> to review</span><i /><span><b>{counts.rejected}</b> rejected</span></div>
              <button className="export-button" disabled={!projectData}><ArrowDownToLine size={14} /> Export picks</button>
            </div>

            <div className="filterbar">
              <div className="filters">
                {(["all", "selected", "review", "rejected"] as Filter[]).map(item => <button key={item} className={filter === item ? "filter active" : "filter"} onClick={() => setFilter(item)}>{item === "all" ? "All frames" : item === "selected" ? "Picked" : item === "review" ? "Review" : "Rejected"}<span>{item === "all" ? photos.length : item === "selected" ? counts.selected : item === "review" ? counts.toReview : counts.rejected}</span></button>)}
              </div>
              <button className="sort-button"><ListFilter size={14} /> Sort: capture time <ChevronDown size={13} /></button>
            </div>

            <div className="content">
              {!projectData ? (
                <div className="empty-state">
                  <div className="empty-icon"><ImagePlus size={22} /></div>
                  <h2>Start with a folder of photographs</h2>
                  <p>ShootR reads your originals in place. It creates a local catalog, groups similar frames, and lets you review every pick before export.</p>
                  <button className="button button-primary" onClick={() => void openFolder()}><FolderOpen size={16} /> Choose a folder</button>
                  <div className="empty-note"><LockKeyhole size={13} /> Photos stay on this computer</div>
                </div>
              ) : visiblePhotos.length === 0 ? (
                <div className="empty-filter"><FileImage size={20} /><span>No frames match this view.</span><button onClick={() => { setFilter("all"); setQuery(""); }}>Show all frames</button></div>
              ) : (
                <div className="review-layout">
                  <div className="photo-area">
                    {selectedPhoto ? <div className="hero-photo">
                      {selectedPhoto.thumbUrl ? <img src={selectedPhoto.thumbUrl} alt={selectedPhoto.fileName} /> : <div className="photo-placeholder"><FileImage size={25} /><span>Preview appears after scan</span></div>}
                      <button className="hero-nav prev" onClick={() => moveSelection(-1)} aria-label="Previous frame">‹</button><button className="hero-nav next" onClick={() => moveSelection(1)} aria-label="Next frame">›</button>
                      <div className="image-caption"><span>{selectedPhoto.fileName}</span><span>{selectedPhoto.kind.toUpperCase()}</span></div>
                    </div> : <div className="photo-placeholder">Select a frame to inspect</div>}
                    <div className="filmstrip">{visiblePhotos.slice(0, 12).map((photo, i) => <button className={photo.id === selectedPhoto?.id ? "thumb active" : "thumb"} onClick={() => setSelectedId(photo.id)} key={photo.id} aria-label={`Open ${photo.fileName}`}>
                      {photo.thumbUrl ? <img src={photo.thumbUrl} alt="" /> : <span className="thumb-index">{String(i + 1).padStart(2, "0")}</span>}
                      <span className={photo.decision === "selected" ? "thumb-mark keep" : photo.decision === "rejected" ? "thumb-mark reject" : "thumb-mark"}>{photo.decision === "selected" ? <Check size={10} /> : photo.decision === "rejected" ? <X size={10} /> : null}</span>
                    </button>)}</div>
                    <div className="keyboard-hints"><span><kbd>←</kbd><kbd>→</kbd> Navigate</span><span><kbd>P</kbd> Pick</span><span><kbd>X</kbd> Reject</span><span className="frame-position">{Math.max(visiblePhotos.indexOf(selectedPhoto!), 0) + 1} / {visiblePhotos.length}</span></div>
                  </div>
                  <aside className="inspector">
                    <div className="inspector-heading"><div><span>FRAME DETAILS</span><h2>Assessment</h2></div><button aria-label="More frame actions"><MoreHorizontal size={18} /></button></div>
                    {analysis && <div className="ad-wait"><span className="ad-label">SPONSORED</span><strong>Optional ad slot</strong><p>Desktop publisher setup is pending. Culling continues at full speed.</p></div>}
                    {selectedPhoto?.assessment ? <>
                      <div className="score-row"><div className="score">{selectedPhoto.assessment.score}<small>/100</small></div><div className={`verdict ${selectedPhoto.assessment.verdict}`}>{selectedPhoto.assessment.verdict}</div></div>
                      <div className="reason-list">{selectedPhoto.assessment.reasons.map(reason => <span key={reason}><Info size={13} />{reason.replaceAll(/([A-Z])/g, " $1").toLowerCase()}</span>)}</div>
                    </> : <div className="assessment-wait"><Sparkles size={16} /><span>{engineInfo?.modelsReady ? "Run local culling to see focus, expression and exposure checks." : "Culling model files are not installed yet. The workspace can still be used for manual review."}</span></div>}
                    <div className="inspector-divider" />
                    <div className="metadata-title">FILE INFORMATION</div>
                    <div className="metadata-row"><span>Camera</span><b>{selectedPhoto?.exif?.camera ?? "—"}</b></div>
                    <div className="metadata-row"><span>Lens</span><b>{selectedPhoto?.exif?.lens ?? "—"}</b></div>
                    <div className="metadata-row"><span>Format</span><b>{selectedPhoto?.kind.toUpperCase() ?? "—"}</b></div>
                    <div className="inspector-divider" />
                    <div className="manual-actions"><button onClick={() => void mark("pick")}><Check size={15} />Pick frame <kbd>P</kbd></button><button onClick={() => void mark("reject")}><X size={15} />Reject frame <kbd>X</kbd></button></div>
                  </aside>
                </div>
              )}
            </div>

            <footer className="statusbar"><div><span className="local-dot" />Local processing <span className="status-sep">·</span>{engineInfo?.accelerator ?? "Engine starting"}</div><div className="ad-status"><span>AD SLOT</span> Desktop publisher setup required</div><div><Command size={12} /> Shortcuts <span className="status-sep">·</span> v0.1</div></footer>
          </>
        ) : page === "profile" ? <AccountPage onSignIn={() => setSignInOpen(true)} photosProcessed={photos.length} picked={counts.selected} /> : <UserManagementPage />}
      </section>
    </main>
  );
}

function AccountPage({ onSignIn, photosProcessed, picked }: { onSignIn: () => void; photosProcessed: number; picked: number }) {
  return <section className="account-page">
    <div className="account-heading"><div><h1>Your profile</h1><p>Keep your ShootR activity and preferences in one place.</p></div><button className="button button-subtle" onClick={onSignIn}><LogIn size={15} />Sign in</button></div>
    <div className="account-card">
      <div className="account-avatar">A</div><div className="account-copy"><span className="eyebrow">SHOOTR ACCOUNT</span><h2>Sign in to sync your profile</h2><p>Account sign-in and saved stats will be connected after the identity service is configured. Local culling does not require an account.</p></div><BadgeCheck className="muted-icon" size={20} />
    </div>
    <div className="stats-heading"><div><span className="eyebrow">THIS SESSION</span><h2>Local activity</h2></div><span className="local-tag"><LockKeyhole size={12} />Stored on this device</span></div>
    <div className="stat-grid"><div><span>Frames in current library</span><strong>{photosProcessed.toLocaleString()}</strong></div><div><span>Picks in current library</span><strong>{picked.toLocaleString()}</strong></div><div><span>Ads completed</span><strong>—</strong></div></div>
    <div className="account-note"><CircleHelp size={16} /><p>Cross-device account history requires an authenticated backend and a privacy policy. ShootR will only sync summary counts, never photo files or image embeddings.</p></div>
  </section>;
}

function AccountDialog({ onClose }: { onClose: () => void }) {
  return <div className="dialog-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><section className="account-dialog" role="dialog" aria-modal="true" aria-labelledby="signin-title"><button className="dialog-close" onClick={onClose} aria-label="Close sign in"><X size={16} /></button><span className="eyebrow">SHOOTR ACCOUNT</span><h2 id="signin-title">Sign in</h2><p>Accounts are planned for profile sync and owner-managed support.</p><label>Email<input type="email" placeholder="you@example.com" disabled /></label><label>Password<input type="password" placeholder="Password" disabled /></label><button className="button button-primary" disabled><LogIn size={14} />Identity service not connected</button><span className="dialog-foot">Local photo review remains available without an account.</span></section></div>;
}

function UserManagementPage() {
  return <section className="account-page">
    <div className="account-heading"><div><h1>User management</h1><p>Owner tools for account health and product activity.</p></div><span className="role-chip"><ShieldAlert size={13} />Owner access required</span></div>
    <div className="admin-empty"><div className="admin-lock"><LockKeyhole size={21} /></div><h2>Admin workspace is not connected</h2><p>User records will appear here after ShootR has a configured identity backend, role checks, and privacy-safe analytics.</p><div className="admin-checks"><span><Check size={14} />Auth provider</span><span><Check size={14} />Server-side owner role</span><span><Check size={14} />User stats schema</span></div></div>
  </section>;
}

export default App;
