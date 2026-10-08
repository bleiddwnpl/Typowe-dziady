import { useState, useEffect, useCallback } from "react";
import { supabase, PICK_LABELS, PICK_NAMES, plural, formatDate } from "../lib";
import { MatchFormFields, useSheetClose } from "../components";

const EMPTY_MATCH = { league_id: "", home: "", away: "", match_date: "", match_time: "18:00", round: "Kolejka 1", odds_home: "", odds_draw: "", odds_away: "" };

const smallBtn = (color, rgb) => ({
  padding: "5px 12px", background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.25)`, color,
  borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
});

// Wysuwane okno od dołu ekranu
function Sheet({ title, subtitle, onClose, children }) {
  useSheetClose(onClose);
  return (
    <div className="mo" onClick={onClose}>
      <div className="mbox" onClick={e => e.stopPropagation()}>
        <div className="mh" />
        <div className="mtt">{title}</div>
        <div className="mst">{subtitle}</div>
        {children}
      </div>
    </div>
  );
}

// ── AUTOMATYCZNE KURSY: ostatnia aktualizacja i przycisk ──────────────────────
function OddsSyncPanel({ onSync }) {
  const [run, setRun] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showMiss, setShowMiss] = useState(false);
  const loadRun = useCallback(async () => {
    const { data } = await supabase.from("odds_sync_runs").select("*").order("ran_at", { ascending: false }).limit(1).maybeSingle();
    setRun(data || null);
  }, []);
  useEffect(() => { loadRun(); }, [loadRun]);

  const sync = async () => { setBusy(true); await onSync(); await loadRun(); setBusy(false); };
  const when = run && new Date(run.ran_at).toLocaleString("pl-PL", { timeZone: "Europe/Warsaw", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const miss = run?.unmatched || [];

  return (
    <div className="sync-card">
      <div className="sync-top">
        <div style={{ minWidth: 0 }}>
          <div className="sync-title">⚡ Kursy automatyczne</div>
          <div className="sync-meta">
            {run ? <>Ostatnio: {when} ({run.trigger === "admin" ? "ręcznie" : "automatycznie"}) · {run.updated} zmian, {run.matched} dopasowanych
              {run.credits_remaining != null && <> · limit API: {run.credits_remaining}</>}</> : "Jeszcze nie było aktualizacji"}
            {run?.error && <div className="err">⚠️ {run.error}</div>}
          </div>
        </div>
        <button className="sync-btn" onClick={sync} disabled={busy}>{busy ? "Pobieranie..." : "Odśwież teraz"}</button>
      </div>
      {miss.length > 0 && (
        <div className="sync-miss">
          <b>{miss.length} {plural(miss.length, "mecz bez dopasowania", "mecze bez dopasowania", "meczów bez dopasowania")}</b> — mają kursy wpisane ręcznie.{" "}
          <button onClick={() => setShowMiss(v => !v)} style={{ background: "none", border: "none", color: "var(--accent-light)", fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0 }}>
            {showMiss ? "Ukryj" : "Pokaż"}
          </button>
          {showMiss && <div style={{ marginTop: 6 }}>{miss.map(m => <div key={m}>• {m}</div>)}</div>}
        </div>
      )}
    </div>
  );
}

// ── ZAKŁADKA ADMIN ────────────────────────────────────────────────────────────
export default function AdminTab({ activeLeague, activeLg, leagues, upcoming, finished, leaguePolls, pollVotes, profiles, tipStats, actions, canSync = false }) {
  const [resultModal, setResultModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [newMatch, setNewMatch] = useState(EMPTY_MATCH);
  const [editModal, setEditModal] = useState(null);
  const [editData, setEditData] = useState({});
  const [addPollModal, setAddPollModal] = useState(false);
  const [newPollQ, setNewPollQ] = useState("");
  const [newPollOpts, setNewPollOpts] = useState(["", ""]);

  const openEdit = m => {
    setEditData({
      league_id: m.league_id, home: m.home, away: m.away, match_date: m.match_date,
      match_time: m.match_time?.slice(0, 5), round: m.round,
      odds_home: parseFloat(m.odds_home).toFixed(2), odds_draw: parseFloat(m.odds_draw).toFixed(2), odds_away: parseFloat(m.odds_away).toFixed(2),
      odds_manual: !!m.odds_manual,
    });
    setEditModal(m);
  };

  const handleSaveResult = async pick => { if (await actions.saveResult(resultModal.id, pick)) setResultModal(null); };
  const handleAddMatch = async () => { if (await actions.addMatch(newMatch)) { setAddModal(false); setNewMatch(EMPTY_MATCH); } };
  const handleSaveEdit = async () => { if (await actions.updateMatch(editModal.id, editData)) setEditModal(null); };
  const handleAddPoll = async () => {
    if (await actions.addPoll(activeLeague, newPollQ, newPollOpts)) {
      setNewPollQ(""); setNewPollOpts(["", ""]); setAddPollModal(false);
    }
  };

  return (
    <>
      {canSync && <OddsSyncPanel onSync={actions.syncOdds} />}
      <div className="sh">Panel — {activeLg?.name}</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button className="mprim" style={{ flex: 1 }} onClick={() => setAddModal(true)}>+ Mecz</button>
        <button onClick={() => setAddPollModal(true)}
          style={{ flex: 1, padding: 14, background: "rgba(var(--poll-rgb),0.1)", border: "1px solid rgba(var(--poll-rgb),0.25)", borderRadius: 14, color: "var(--poll)", fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          + Ankieta
        </button>
      </div>

      {/* ANKIETY */}
      {leaguePolls.length > 0 && <>
        <div className="sh">Ankiety</div>
        <div className="rc" style={{ marginBottom: 16 }}>
          {leaguePolls.map((poll, i, arr) => (
            <div key={poll.id} style={{ padding: "12px 16px", borderBottom: i < arr.length - 1 ? "1px solid rgba(var(--ink-rgb),0.05)" : "none" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>{poll.question}</div>
              <div style={{ fontSize: 11, color: "rgba(var(--ink-rgb),0.4)", marginBottom: 8 }}>
                {(n => `${n} ${plural(n, "głos", "głosy", "głosów")}`)(pollVotes.filter(v => v.poll_id === poll.id).length)} ·{" "}
                <span style={{ color: poll.status === "active" ? "var(--win)" : "var(--warn)" }}>{poll.status === "active" ? "Aktywna" : "Zamknięta"}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {poll.status === "active" && <button onClick={() => actions.closePoll(poll.id)} style={smallBtn("var(--warn)", "255,149,0")}>Zamknij</button>}
                <button onClick={() => actions.deletePoll(poll.id)} style={smallBtn("var(--loss)", "255,59,48")}>Usuń</button>
              </div>
            </div>
          ))}
        </div>
      </>}

      {/* NADCHODZĄCE + kto nie wytypował */}
      {upcoming.length > 0 && <>
        <div className="sh">Nadchodzące</div>
        <div className="rc" style={{ marginBottom: 10 }}>
          {upcoming.map((m, i) => {
            const tipped = new Set(tipStats[m.id]?.tipped || []);
            const notTipped = profiles.filter(p => !tipped.has(p.id));
            return (
              <div key={m.id} style={{ borderBottom: i < upcoming.length - 1 ? "1px solid rgba(var(--ink-rgb),0.05)" : "none" }}>
                <div className="ar" style={{ borderBottom: "none" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="an">{m.home} vs {m.away}</div>
                    <div className="at">{formatDate(m.match_date)} · {m.match_time?.slice(0, 5)} · {m.round}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button className="aedt" onClick={() => openEdit(m)}>Edytuj</button>
                    <button className="ares-btn" onClick={() => setResultModal(m)}>Wynik</button>
                  </div>
                </div>
                <div style={{ padding: "0 16px 12px" }}>
                  {notTipped.length === 0 ? (
                    <div style={{ fontSize: 11, color: "var(--win)", fontWeight: 600 }}>✓ Wszyscy wytypowali</div>
                  ) : (
                    <>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(var(--ink-rgb),0.3)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 5 }}>
                        Brak typu ({notTipped.length}):
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {notTipped.map(p => (
                          <span key={p.id} style={{ fontSize: 11, fontWeight: 600, color: "var(--warn)", background: "rgba(var(--warn-rgb),0.08)", border: "1px solid rgba(var(--warn-rgb),0.2)", padding: "2px 9px", borderRadius: 20 }}>
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>}

      {/* ZAKOŃCZONE */}
      {finished.length > 0 && <>
        <div className="sh">Zakończone</div>
        <div className="rc">
          {finished.map((m, i) => (
            <div key={m.id} className="ar" style={{ borderBottom: i < finished.length - 1 ? "1px solid rgba(var(--ink-rgb),0.05)" : "none" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="an">{m.home} vs {m.away}</div>
                <div className="at" style={{ color: "var(--accent-light)" }}>Wynik: {PICK_LABELS[m.result]}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button className="aedt" onClick={() => openEdit(m)}>Edytuj</button>
                <button className="ares-btn" onClick={() => setResultModal(m)}>Popraw</button>
              </div>
            </div>
          ))}
        </div>
      </>}

      {/* OKNA */}
      {resultModal && (
        <Sheet title={`${resultModal.home} vs ${resultModal.away}`} subtitle="Wybierz wynik meczu" onClose={() => setResultModal(null)}>
          <div style={{ display: "flex", gap: 10 }}>
            {["home", "draw", "away"].map(pick => (
              <button key={pick} className="rbtn" onClick={() => handleSaveResult(pick)}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{PICK_LABELS[pick]}</div>
                <div style={{ fontSize: 11, marginTop: 4, color: "rgba(var(--ink-rgb),0.4)" }}>{PICK_NAMES[pick]}</div>
              </button>
            ))}
          </div>
          <button className="msec" style={{ marginTop: 12 }} onClick={() => setResultModal(null)}>Anuluj</button>
        </Sheet>
      )}

      {addModal && (
        <Sheet title="Dodaj mecz ⚽" subtitle="Wypełnij dane meczu" onClose={() => setAddModal(false)}>
          <MatchFormFields data={newMatch} onChange={setNewMatch} leagues={leagues} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
            <button className="mprim" onClick={handleAddMatch}>Dodaj mecz</button>
            <button className="msec" onClick={() => setAddModal(false)}>Anuluj</button>
          </div>
        </Sheet>
      )}

      {editModal && (
        <Sheet title="Edytuj mecz ✏️" subtitle="Zmień dane meczu" onClose={() => setEditModal(null)}>
          <MatchFormFields data={editData} onChange={setEditData} leagues={leagues} />
          <label className="auto-toggle">
            <input type="checkbox" checked={!editData.odds_manual} onChange={e => setEditData({ ...editData, odds_manual: !e.target.checked })} />
            <span>
              Aktualizuj kursy automatycznie
              <small>{editData.odds_manual
                ? "Kursy są ustawione ręcznie — automat ich nie zmienia."
                : "Jeśli zmienisz kursy ręcznie, automat dla tego meczu się wyłączy."}</small>
            </span>
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
            <button className="mprim" onClick={handleSaveEdit}>Zapisz zmiany</button>
            <button className="msec" onClick={() => setEditModal(null)}>Anuluj</button>
          </div>
        </Sheet>
      )}

      {addPollModal && (
        <Sheet title="🗳️ Dodaj ankietę" subtitle="Zbierz opinie od uczestników" onClose={() => setAddPollModal(false)}>
          <input className="mi" placeholder="Pytanie (np. Który trener odejdzie pierwszy?)" value={newPollQ} onChange={e => setNewPollQ(e.target.value)} />
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(var(--ink-rgb),0.4)", letterSpacing: 1, textTransform: "uppercase", margin: "4px 0 8px" }}>Odpowiedzi</div>
          {newPollOpts.map((opt, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input className="mi" style={{ marginBottom: 0, flex: 1 }} placeholder={`Odpowiedź ${i + 1}`} value={opt}
                onChange={e => { const o = [...newPollOpts]; o[i] = e.target.value; setNewPollOpts(o); }} />
              {newPollOpts.length > 2 && (
                <button onClick={() => setNewPollOpts(prev => prev.filter((_, j) => j !== i))}
                  style={{ padding: "0 14px", background: "rgba(var(--loss-rgb),0.08)", border: "1px solid rgba(var(--loss-rgb),0.2)", color: "var(--loss)", borderRadius: 12, cursor: "pointer", fontFamily: "inherit", fontSize: 18, flexShrink: 0 }}>✕</button>
              )}
            </div>
          ))}
          {newPollOpts.length < 6 && (
            <button onClick={() => setNewPollOpts(prev => [...prev, ""])}
              style={{ width: "100%", padding: 10, background: "rgba(var(--poll-rgb),0.06)", border: "1px dashed rgba(var(--poll-rgb),0.25)", borderRadius: 12, color: "var(--poll)", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 16 }}>
              + Dodaj odpowiedź
            </button>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="mprim" onClick={handleAddPoll}>Dodaj ankietę</button>
            <button className="msec" onClick={() => setAddPollModal(false)}>Anuluj</button>
          </div>
        </Sheet>
      )}
    </>
  );
}
