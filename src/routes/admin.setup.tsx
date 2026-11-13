import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { getSupabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/setup")({ component: AdminSetup });

function AdminSetup() {
  const supabase = getSupabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setMessage("");
    if (!supabase) { setError("Supabase is not configured. Check the public client variables in Vercel Production."); return; }
    setBusy(true);
    try {
      // Password is sent only to Supabase Auth over its normal HTTPS sign-in flow.
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError || !data.session?.access_token) throw new Error("Could not sign in to the existing owner account.");

      const response = await fetch("/api/admin/bootstrap", {
        method: "POST",
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      });
      const result = await response.json() as { error?: string; message?: string };
      await supabase.auth.signOut();
      setPassword("");
      if (!response.ok) throw new Error(result.error || "Owner authorization failed.");
      setComplete(true);
      setMessage(result.message || "The existing owner account is authorized. Sign in again.");
    } catch (submitError) {
      await supabase?.auth.signOut();
      setPassword("");
      setError(submitError instanceof Error ? submitError.message : "Owner authorization failed.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="media-admin-login"><div className="media-admin-login-card">
    <Link to="/" className="media-admin-brand">SARRAF <span>PROPERTIES</span></Link>
    <p className="media-admin-eyebrow">ONE-TIME OWNER AUTHORIZATION</p>
    <h1>Authorize the existing owner</h1>
    <p className="media-admin-muted">Sign in with the existing account configured for this project. This will not create an account or change its password.</p>
    {!supabase && <div className="media-admin-notice">Supabase client configuration is missing. Check <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.</div>}
    {message && <div className="media-admin-notice" role="status">{message}</div>}
    {error && <p className="media-admin-error" role="alert">{error}</p>}
    {!complete && <form onSubmit={submit} className="media-admin-form">
      <label>Owner email<input type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required /></label>
      <label>Current password<input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></label>
      <button className="media-admin-primary" disabled={busy || !supabase}>{busy ? "Verifying owner…" : "Authorize existing account"}</button>
    </form>}
    <Link className="media-admin-back" to="/admin/login">← Admin sign in</Link>
  </div></main>;
}
