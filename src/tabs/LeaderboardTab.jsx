import { useState, useMemo } from "react";
import { buildPlayerStats } from "../lib";
import { ClubAvatar } from "../components";

const pctFmt = v => `${v}%`;
const oddsFmt = v => v.toFixed(2);
const ROWS = [
  ["Skuteczność", s => s.pct, pctFmt],
  ["Na faworyta", s => s.favPct, pctFmt],
  ["Na niespodziankę", s => s.upsPct, pctFmt],
  ["Najdłuższa seria", s => s.longestStreak, v => `${v}`],
  ["Najwyższy kurs", s => s.bestOdds?.odds ?? null, oddsFmt],
  ["Średni trafiony kurs", s => s.avgOdds, oddsFmt],
];

// Porównanie: wybrany gracz kontra Ty (albo same Twoje liczby po kliknięciu siebie)
function CompareSheet({ other, me, finished, tips, onClose }) {
  const isSelf = other.id === me?.id;
  const a = useMemo(() => buildPlayerStats(other.id, tips, finished), [other.id, tips, finished]);
  const b = useMemo(() => (me ? buildPlayerStats(me.id, tips, finished) : null), [me, tips, finished]);

  let myWins = 0, compared = 0;
  const rows = ROWS.map(([label, get, fmt]) => {
    const va = get(a), vb = b ? get(b) : null;
    let winA = false, winB = false;
    if (!isSelf && va != null && vb != null && va !== vb) {
      compared++;
      if (va > vb) winA = true; else { winB = true; myWins++; }
    }
    return { label, va: va == null ? "—" : fmt(va), vb: vb == null ? "—" : fmt(vb), winA, winB };
  });

  return (
    <div className="mo" onClick={onClose}>
      <div className="mbox" onClick={e => e.stopPropagation()}>
        <div className="mh" />
        {isSelf ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <ClubAvatar favoriteTeam={other.favorite_team} name={other.name} size={38} />
              <div>
                <div className="mtt" style={{ marginBottom: 0 }}>Twoje statystyki</div>
                <div className="mst" style={{ marginBottom: 0 }}>{a.settled} rozstrzygniętych typów w tej lidze</div>
              </div>
            </div>
            {rows.map(r => (
              <div key={r.label} className="cmp" style={{ gridTemplateColumns: "1fr 70px" }}>
                <div className="m" style={{ textAlign: "left", fontSize: 13 }}>{r.label}</div>
                <div className="v">{r.va}</div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="cmp-head">
              <div className="cmp-p"><ClubAvatar favoriteTeam={other.favorite_team} name={other.name} size={38} /><span>{other.name}</span></div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: "rgba(255,255,255,0.35)" }}>VS</div>
              <div className="cmp-p"><ClubAvatar favoriteTeam={me?.favorite_team} name={me?.name || ""} size={38} /><span>Ty</span></div>
            </div>
            {rows.map(r => (
              <div key={r.label} className="cmp">
                <div className={`v ${r.winA ? "win" : r.winB ? "lose" : ""}`}>{r.va}</div>
                <div className="m">{r.label}</div>
                <div className={`v ${r.winB ? "win" : r.winA ? "lose" : ""}`}>{r.vb}</div>
              </div>
            ))}
            {compared > 0 && (
              <div style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 12 }}>
                {myWins > compared / 2 ? `Wygrywasz w ${myWins} z ${compared} kategorii 💪`
                  : myWins === compared / 2 ? `Remis: po ${myWins} kategorie dla każdego 🤝`
                  : `${other.name} wygrywa w ${compared - myWins} z ${compared} kategorii`}
              </div>
            )}
          </>
        )}
        <button className="msec" style={{ marginTop: 16 }} onClick={onClose}>Zamknij</button>
      </div>
    </div>
  );
}

// ── ZAKŁADKA TABELA ───────────────────────────────────────────────────────────
// Strzałka zmiany miejsca pod numerem pozycji
function RankDelta({ d }) {
  if (d > 0) return <div className="rdelta" style={{ color: "#34c759" }}>▲{d}</div>;
  if (d < 0) return <div className="rdelta" style={{ color: "#ff453a" }}>▼{-d}</div>;
  return <div className="rdelta" style={{ color: "rgba(255,255,255,0.25)" }}>–</div>;
}

export default function LeaderboardTab({ lb, roundStars, rankChanges, userId, activeLg, finished, tips }) {
  const [selected, setSelected] = useState(null);
  const me = lb.find(u => u.id === userId);

  return (
    <>
      <div className="sh">Klasyfikacja — {activeLg?.flag} {activeLg?.name}</div>
      {lb.length === 0 && <div className="empty"><div className="ei">🏆</div><div className="et">Brak uczestników</div></div>}
      {lb.length > 0 && (
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "-4px 2px 8px" }}>
          {rankChanges ? `Zmiany pozycji po: ${rankChanges.round} · ` : ""}Dotknij gracza, żeby porównać się z nim
        </div>
      )}
      <div className="lbc">
        {lb.map((u, i) => (
          <div key={u.id} className={`lbr click ${u.id === userId ? "me" : ""}`} onClick={() => setSelected(u)}>
            <div className={`lbrank ${rankChanges ? "col" : ""}`}>
              <div>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : <span className="lbrn">#{i + 1}</span>}</div>
              {rankChanges && <RankDelta d={rankChanges.changes[u.id]} />}
            </div>
            <ClubAvatar favoriteTeam={u.favorite_team} name={u.name} size={36} />
            <div style={{ flex: 1 }}>
              <div className="lbn">
                {u.name}
                {u.id === userId && <span className="lbme">TY</span>}
                {roundStars[u.id] > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fbbf24", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", padding: "1px 7px", borderRadius: 20 }}>
                    ⭐ ×{roundStars[u.id]}
                  </span>
                )}
              </div>
              <div className="lbs">
                {u.correct} trafione ·{" "}
                <span style={{ color: u.balance >= 0 ? "#34c759" : "#ff3b30", fontWeight: 700 }}>
                  {u.balance >= 0 ? "+" : ""}{u.balance.toFixed(0)} zł
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className={`lbp ${i === 0 ? "top" : "nm"}`}>{u.points.toFixed(2)}</div>
              <div className="lbpl">PKT</div>
            </div>
          </div>
        ))}
      </div>

      {selected && <CompareSheet other={selected} me={me} finished={finished} tips={tips} onClose={() => setSelected(null)} />}
    </>
  );
}
