import { useMemo } from "react";
import { buildLeaderboard } from "../lib";
import { ClubAvatar } from "../components";

const RULES = [
  { icon: "⏱️", bg: "rgba(0,122,255,0.1)", title: "Typowanie", text: "Wybierasz wynik meczu: 1, X lub 2. Typ możesz zmienić przed godziną startu — po jej upływie typowanie jest zablokowane." },
  { icon: "🎯", bg: "rgba(255,59,48,0.1)", title: "Punktacja", text: "Za trafiony typ dostajesz tyle punktów ile wynosił kurs bukmacherski. Za chybiony typ — 0 punktów." },
  { icon: "⭐", bg: "rgba(251,191,36,0.1)", title: "Gwiazdki za kolejkę", text: "Gracz z najwyższą sumą punktów w danej kolejce zdobywa gwiazdkę ⭐. Przy remisie gwiazdkę dostają wszyscy z najwyższym wynikiem. Licznik gwiazdek widoczny jest w rankingu." },
  { icon: "🏆", bg: "rgba(0,122,255,0.08)", title: "Klasyfikacja", text: "Wygrywa gracz z największą sumą punktów po zakończeniu sezonu — licząc wszystkie ligi razem. Ekstraklasa ma dodatkowo osobny ranking z nagrodą 100 zł." },
];

// ── ZAKŁADKA REGULAMIN ────────────────────────────────────────────────────────
export default function RulesTab({ profiles, tips, matches, leagues, userId }) {
  const { globalLb, ekstraLb } = useMemo(() => {
    const ekstraId = leagues.find(l => l.name === "Ekstraklasa")?.id;
    return {
      globalLb: buildLeaderboard(profiles, tips, matches, matches.map(m => m.id)),
      ekstraLb: buildLeaderboard(profiles, tips, matches, matches.filter(m => m.league_id === ekstraId).map(m => m.id)),
    };
  }, [profiles, tips, matches, leagues]);

  const prizes = [
    { emoji: "🥇", name: "1. miejsce (wszystkie ligi)", amount: "100 zł", color: "#ffd700", bg: "rgba(255,215,0,0.08)", leader: globalLb[0] },
    { emoji: "🥈", name: "2. miejsce (wszystkie ligi)", amount: "30 zł", color: "#c0c0c0", bg: "rgba(192,192,192,0.08)", leader: globalLb[1] },
    { emoji: "🥉", name: "3. miejsce (wszystkie ligi)", amount: "20 zł", color: "#cd7f32", bg: "rgba(205,127,50,0.08)", leader: globalLb[2] },
    { emoji: "🏆", name: "Klasyfikacja Ekstraklasy — 1. miejsce", amount: "100 zł", color: "#f97316", bg: "rgba(249,115,22,0.08)", leader: ekstraLb[0] },
  ];

  return (
    <>
      <div className="sh">Nagrody</div>
      <div className="rc" style={{ marginBottom: 10 }}>
        {prizes.map((r, i, arr) => (
          <div key={r.name} className="prow" style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 12 }}>
              <div className="pic2" style={{ background: r.bg }}>{r.emoji}</div>
              <div style={{ flex: 1 }}><div className="pnm">{r.name}</div></div>
              <div className="pamt" style={{ color: r.color }}>{r.amount}</div>
            </div>
            {r.leader && r.leader.points > 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 60, width: "100%" }}>
                <ClubAvatar favoriteTeam={r.leader.favorite_team} name={r.leader.name} size={22} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{r.leader.name}</span>
                {r.leader.id === userId && <span className="lbme">TY</span>}
                <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>{r.leader.points.toFixed(2)} pkt</span>
              </div>
            ) : (
              <div style={{ paddingLeft: 60, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Brak danych</div>
            )}
          </div>
        ))}
      </div>

      <div className="sh" style={{ marginTop: 16 }}>Zasady gry</div>
      {RULES.map(s => (
        <div key={s.title} className="rc" style={{ marginBottom: 8 }}>
          <div className="rrow">
            <div className="ric" style={{ background: s.bg }}>{s.icon}</div>
            <div><div className="rtit">{s.title}</div><div className="rtxt">{s.text}</div></div>
          </div>
        </div>
      ))}
    </>
  );
}
