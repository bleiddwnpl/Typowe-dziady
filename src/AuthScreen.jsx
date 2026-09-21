import { useState } from "react";
import { supabase } from "./lib";
import { css } from "./styles";

// ── AUTH ──────────────────────────────────────────────────────────────────────
export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleReset = async () => {
    if (!resetEmail.trim()) { setError("Wpisz swój adres e-mail"); return; }
    setLoading(true); setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, { redirectTo: window.location.origin });
    setLoading(false);
    if (error) { setError("Nie znaleziono konta z tym adresem"); return; }
    setResetSent(true);
  };

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError("Nieprawidłowy e-mail lub hasło"); setLoading(false); return; }
      onAuth(data.user);
    } else {
      if (!name.trim()) { setError("Wpisz swoje imię lub pseudonim"); setLoading(false); return; }
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name: name.trim() } } });
      if (error) { setError(error.message); setLoading(false); return; }
      if (data.user) {
        await supabase.from("profiles").upsert({ id: data.user.id, name: name.trim(), is_admin: false });
        onAuth(data.user);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <style>{css}</style>
      <div className="auth-screen">
        <div className="photo-bg" /><div className="ov1" /><div className="ov2" />
        <div className="auth-hero">
          <div className="eyebrow"><div className="ey-line" /><span className="ey-txt">Typowanie meczów</span></div>
          <div className="hero-title">TYPOWE<br /><span className="hero-blue">DZIADY</span></div>
          <div className="hero-sub">Typuj mecze ligowe ze znajomymi.<br />Kursy bukmacherskie. Prawdziwa rywalizacja.</div>
        </div>
        <div className="auth-card">
          <div className="card-shine" />
          {resetMode ? (
            <>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Resetuj hasło</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{resetSent ? "Sprawdź skrzynkę e-mail." : "Podaj e-mail — wyślemy link."}</div>
              </div>
              {!resetSent && <>
                <div className="afield"><span className="aicon">✉️</span><input className="ainput" type="email" placeholder="Adres e-mail" value={resetEmail} onChange={e => setResetEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleReset()} /></div>
                {error && <div className="aerr">{error}</div>}
                <button className="acta" onClick={handleReset} disabled={loading}>{loading ? "Wysyłanie..." : "Wyślij link →"}</button>
              </>}
              {resetSent && <div className="reset-ok">✓ Link wysłany! Sprawdź skrzynkę.</div>}
              <button className="back-btn" onClick={() => { setResetMode(false); setResetSent(false); setError(""); }}>← Wróć do logowania</button>
            </>
          ) : (
            <>
              <div className="seg">
                {["login","register"].map(m => (
                  <button key={m} className={`seg-btn ${mode === m ? "on" : ""}`} onClick={() => setMode(m)}>{m === "login" ? "Logowanie" : "Rejestracja"}</button>
                ))}
              </div>
              {mode === "register" && <div className="afield"><span className="aicon">👤</span><input className="ainput" placeholder="Imię lub pseudonim" value={name} onChange={e => setName(e.target.value)} /></div>}
              <div className="afield"><span className="aicon">✉️</span><input className="ainput" type="email" placeholder="Adres e-mail" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div className="afield"><span className="aicon">🔒</span><input className="ainput" type="password" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} /></div>
              {error && <div className="aerr">{error}</div>}
              <button className="acta" onClick={handleSubmit} disabled={loading}>{loading ? "Ładowanie..." : mode === "login" ? "Zaloguj się →" : "Zarejestruj się →"}</button>
              {mode === "login" && <button className="forgot-btn" onClick={() => { setResetMode(true); setError(""); }}>Nie pamiętam hasła</button>}
            </>
          )}
        </div>
      </div>
    </>
  );
}
