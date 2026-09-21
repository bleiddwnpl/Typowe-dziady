import { ClubAvatar } from "../components";

// ── ZAKŁADKA TABELA ───────────────────────────────────────────────────────────
export default function LeaderboardTab({ lb, roundStars, userId, activeLg }) {
  return (
    <>
      <div className="sh">Klasyfikacja — {activeLg?.flag} {activeLg?.name}</div>
      {lb.length === 0 && <div className="empty"><div className="ei">🏆</div><div className="et">Brak uczestników</div></div>}
      <div className="lbc">
        {lb.map((u, i) => (
          <div key={u.id} className={`lbr ${u.id === userId ? "me" : ""}`}>
            <div className="lbrank">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : <span className="lbrn">#{i + 1}</span>}</div>
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
    </>
  );
}
