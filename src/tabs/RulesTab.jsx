import { useMemo } from "react";
import { buildLeaderboard } from "../lib";
import { ClubAvatar } from "../components";

const RULES = [
  { icon: "⏱️", bg: "rgba(var(--accent-rgb),0.1)", title: "Typowanie", text: "Wybierasz wynik meczu: 1, X lub 2. Typ możesz zmienić przed godziną startu — po jej upływie typowanie jest zablokowane." },
  { icon: "🎯", bg: "rgba(var(--loss-rgb),0.1)", title: "Punktacja", text: "Za trafiony typ dostajesz tyle punktów ile wynosił kurs bukmacherski. Za chybiony typ — 0 punktów." },
  { icon: "⭐", bg: "rgba(var(--gold-rgb),0.1)", title: "Gwiazdki za kolejkę", text: "Gracz z najwyższą sumą punktów w danej kolejce zdobywa gwiazdkę ⭐. Przy remisie gwiazdkę dostają wszyscy z najwyższym wynikiem. Licznik gwiazdek widoczny jest w rankingu." },
  { icon: "🏆", bg: "rgba(var(--accent-rgb),0.08)", title: "Klasyfikacja", text: "Wygrywa gracz z największą sumą punktów po zakończeniu sezonu — licząc wszystkie ligi razem. Ekstraklasa ma dodatkowo osobny ranking z nagrodą 100 zł." },
];

// Harmonogram automatu (funkcja sync-odds w Supabase) — godziny w czasie polskim
const AUTO = [
  { icon: "📅", bg: "rgba(var(--accent-rgb),0.1)", title: "Dodawanie meczów — wtorek, 8:00",
    text: "Mecze najbliższego weekendu (od piątku do poniedziałku) z Ekstraklasy, Premier League, La Liga i Serie A dodają się same. Mecze Ligi Mistrzów dodaje admin." },
  { icon: "📈", bg: "rgba(var(--win-rgb),0.1)", title: "Kursy — codziennie, 8:00",
    text: "Kurs to mediana kursów bukmacherów europejskich, więc może różnić się o kilka setnych od kursów polskich bukmacherów. Strzałka ▲ lub ▼ przy kursie pokazuje, że od dodania meczu kurs wzrósł lub spadł. Punkty liczymy z ostatniego kursu przed rozpoczęciem meczu — dla wszystkich takiego samego, bez względu na to, kiedy typowałeś." },
  { icon: "🏁", bg: "rgba(var(--gold-rgb),0.1)", title: "Wyniki — codziennie, 18:30 i 23:15",
    text: "Wyniki zakończonych meczów wpisują się same, a razem z nimi rozliczają się typy, tabela, gwiazdki i podsumowanie kolejki. Jeśli wyniku nie ma jeszcze w serwisie (np. mecz się przedłużył albo został przełożony), pojawi się przy kolejnej aktualizacji albo wpisze go admin." },
  { icon: "🧾", bg: "rgba(var(--poll-rgb),0.1)", title: "Strefa kuponów",
    text: "Typy do wspólnego kuponu można dodawać do piątku do 12:00. Kursy na kuponie to kursy z piątku z 8:00 — późniejsze zmiany kuponu już nie ruszają." },
];

function RuleCard({ icon, bg, title, text }) {
  return (
    <div className="rc" style={{ marginBottom: 8 }}>
      <div className="rrow">
        <div className="ric" style={{ background: bg }}>{icon}</div>
        <div><div className="rtit">{title}</div><div className="rtxt">{text}</div></div>
      </div>
    </div>
  );
}

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
          <div key={r.name} className="prow" style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(var(--ink-rgb),0.05)" : "none", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 12 }}>
              <div className="pic2" style={{ background: r.bg }}>{r.emoji}</div>
              <div style={{ flex: 1 }}><div className="pnm">{r.name}</div></div>
              <div className="pamt" style={{ color: r.color }}>{r.amount}</div>
            </div>
            {r.leader && r.leader.points > 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 60, width: "100%" }}>
                <ClubAvatar favoriteTeam={r.leader.favorite_team} name={r.leader.name} size={22} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(var(--ink-rgb),0.7)" }}>{r.leader.name}</span>
                {r.leader.id === userId && <span className="lbme">TY</span>}
                <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: "rgba(var(--ink-rgb),0.4)" }}>{r.leader.points.toFixed(2)} pkt</span>
              </div>
            ) : (
              <div style={{ paddingLeft: 60, fontSize: 12, color: "rgba(var(--ink-rgb),0.2)" }}>Brak danych</div>
            )}
          </div>
        ))}
      </div>

      <div className="sh" style={{ marginTop: 16 }}>Zasady gry</div>
      {RULES.map(s => <RuleCard key={s.title} {...s} />)}

      <div className="sh" style={{ marginTop: 16 }}>Automatyczne aktualizacje</div>
      {AUTO.map(s => <RuleCard key={s.title} {...s} />)}
      <div className="rc" style={{ marginBottom: 8 }}>
        <div className="rrow">
          <div className="ric" style={{ background: "rgba(var(--ink-rgb),0.06)" }}>🔗</div>
          <div>
            <div className="rtit">Źródło danych</div>
            <div className="rtxt">
              Mecze, kursy i wyniki pobieramy z serwisu{" "}
              <a href="https://the-odds-api.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-light)", fontWeight: 700 }}>The Odds API</a>
              {" "}(the-odds-api.com). Wszystkie godziny podane są w czasie polskim. Admin może w każdej chwili poprawić mecz, kurs lub wynik ręcznie.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
