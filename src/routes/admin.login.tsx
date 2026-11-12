import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { getSupabase, isMediaAdmin } from "@/lib/supabase";

export const Route = createFileRoute("/admin/login")({ component: AdminLogin });

function AdminLogin() {
  const navigate = useNavigate();
  const supabase = getSupabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let alive = true;
    void supabase?.auth.getUser().then(({ data }) => {
      if (alive && isMediaAdmin(data.user)) void navigate({ to: "/admin" });
    });
    return () => { alive = false; };
  }, [navigate, supabase]);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    if (!supabase) { setError("Supabase is not configured. Follow SUPABASE_SETUP.md first."); return; }
    setBusy(true);
    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError || !isMediaAdmin(data.user)) {
      if (data.user) await supabase.auth.signOut();
      setError(loginError?.message || "This account is not authorized as a media admin."); setBusy(false); return;
    }
    setBusy(false); await navigate({ to: "/admin" });
  }
  return <main className="media-admin-login"><div className="media-admin-login-card"><Link to="/" className="media-admin-brand">SARRAF <span>PROPERTIES</span></Link><p className="media-admin-eyebrow">PRIVATE MEDIA MANAGEMENT</p><h1>Admin sign in</h1><p className="media-admin-muted">Use your authorized Supabase administrator account.</p>
    {!supabase && <div className="media-admin-notice">Backend setup is required. Configure the environment values in <code>.env</code> and complete the steps in <code>SUPABASE_SETUP.md</code>.</div>}
    <form onSubmit={submit} className="media-admin-form"><label>Email address<input type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required /></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /></label>{error && <p className="media-admin-error" role="alert">{error}</p>}<button className="media-admin-primary" disabled={busy || !supabase}>{busy ? "Signing in…" : "Sign in"}</button></form>
    <Link className="media-admin-back" to="/">← Back to website</Link></div></main>;
}
