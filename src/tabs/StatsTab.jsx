import { useState, useMemo } from "react";
import { buildPlayerStats, buildGroupRecords } from "../lib";
import { ClubAvatar } from "../components";

const verdict = s => {
  if (s.favTotal < 3 || s.upsTotal < 3) return "Za mało typów, żeby porównać — typuj dalej.";
  if (s.favPct > s.upsPct) return "Lepiej Ci idzie z faworytami.";
  if (s.upsPct > s.favPct) return "Lepiej wyczuwasz niespodzianki.";
  return "Tak samo dobrze z faworytami i niespodziankami.";
};

function SplitBar({ icon, label, correct, total, value, color }) {
  return (
    <div>
      <div className="st-split-row">
        <span>{icon} {label}</span>
        <span>{value == null ? "—" : `${value}% · ${correct} z ${total}`}</span>
      </div>
      <div className="st-bar"><div style={{ width: `${value || 0}%`, background: color }} /></div>
    </div>
  );
}

// ── ZAKŁADKA STATYSTYKI ───────────────────────────────────────────────────────
export default function StatsTab({ profiles, tips, matches, leagues, userId }) {
  const [league, setLeague] = useState("all");

  const finished = useMemo(
    () => matches.filter(m => m.status === "finished" && (league === "all" || m.league_id === league)),
    [matches, league]
  );
  const statsById = useMemo(
    () => Object.fromEntries(profiles.map(p => [p.id, buildPlayerStats(p.id, tips, finished)])),
    [profiles, tips, finished]
  );
  const records = useMemo(() => buildGroupRecords(profiles, statsById), [profiles, statsById]);

  const me = statsById[userId];
  const meProfile = profiles.find(p => p.id === userId);
  const all = Object.values(statsById);
  const groupSettled = all.reduce((s, x) => s + x.settled, 0);
  const groupPct = groupSettled ? Math.round((all.reduce((s, x) => s + x.correct, 0) / groupSettled) * 100) : null;

  return (
    <>
      <div className="st-chips">
        <button className={`st-chip ${league === "all" ? "on" : ""}`} onClick={() => setLeague("all")}>Wszystkie ligi</button>
        {leagues.map(l => (
          <button key={l.id} className={`st-chip ${league === l.id ? "on" : ""}`} onClick={() => setLeague(l.id)}>{l.name}</button>
        ))}
      </div>

      {!me || me.settled === 0 ? (
        <div className="empty">
          <div className="ei">📊</div>
          <div className="et">Brak rozstrzygniętych typów</div>
          <div className="es">Statystyki pojawią się po pierwszym zakończonym meczu, który wytypowałeś.</div>
        </div>
      ) : (
        <>
          <div className="st-card">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ClubAvatar favoriteTeam={meProfile?.favorite_team} name={meProfile?.name || ""} size={34} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{meProfile?.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{me.settled} rozstrzygniętych typów</div>
              </div>
            </div>
            <div className="st-big">
              <div className="st-pct">{me.pct}%</div>
              <div className="st-pctl">skuteczności<br />{me.correct} z {me.settled} trafionych</div>
            </div>
            {groupPct != null && <div className="st-note">Średnia grupy: {groupPct}%</div>}
          </div>

          <div className="st-card">
            <div className="sh" style={{ marginBottom: 10 }}>Faworyci czy niespodzianki?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <SplitBar icon="🛡️" label="Na faworyta" correct={me.favCorrect} total={me.favTotal} value={me.favPct} color="#34c759" />
              <SplitBar icon="💥" label="Na niespodziankę" correct={me.upsCorrect} total={me.upsTotal} value={me.upsPct} color="#f59e0b" />
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 10 }}>{verdict(me)}</div>
          </div>

          <div className="st-grid">
            <div className="st-tile"><div className="t">🔥 Najdłuższa seria</div><div className="v">{me.longestStreak}</div><div className="d">trafień z rzędu</div></div>
            <div className="st-tile"><div className="t">▶️ Obecna seria</div><div className="v">{me.currentStreak}</div><div className="d">trafień z rzędu</div></div>
            <div className="st-tile"><div className="t">🎯 Najwyższy kurs</div><div className="v">{me.bestOdds ? me.bestOdds.odds.toFixed(2) : "—"}</div><div className="d">{me.bestOdds?.detail || "brak trafień"}</div></div>
            <div className="st-tile"><div className="t">📈 Średni trafiony kurs</div><div className="v">{me.avgOdds ? me.avgOdds.toFixed(2) : "—"}</div><div className="d">im wyżej, tym odważniej</div></div>
          </div>
        </>
      )}

      {records.length > 0 && <>
        <div className="sh" style={{ marginTop: 16 }}>Rekordy grupy</div>
        <div className="st-card">
          {records.map(r => (
            <div key={r.label} className="st-rec">
              <ClubAvatar favoriteTeam={r.people[0].favorite_team} name={r.people[0].name} size={28} />
              <div style={{ minWidth: 0 }}>
                <div className="n">
                  {r.people.map(p => p.name).join(", ")}
                  {r.people.some(p => p.id === userId) && <span className="lbme" style={{ marginLeft: 6 }}>TY</span>}
                </div>
                <div className="w">{r.label}{r.hint ? ` · ${r.hint}` : ""}</div>
              </div>
              <div className="val">{r.value}</div>
            </div>
          ))}
        </div>
      </>}
    </>
  );
}
