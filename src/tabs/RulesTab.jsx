import { useMemo } from "react";
import { buildLeaderboard, couponMatchesById, buildCouponLedger, money, zl, COUPON_STAKE, firstRealCouponWeekend, weekendLabel } from "../lib";
import { ClubAvatar } from "../components";

const RULES = [
  { icon: "⏱️", bg: "rgba(var(--accent-rgb),0.1)", title: "Typowanie", text: "Wybierasz wynik meczu: 1, X lub 2. Typ możesz zmienić przed godziną startu — po jej upływie typowanie jest zablokowane." },
  { icon: "🎯", bg: "rgba(var(--loss-rgb),0.1)", title: "Punktacja", text: "Za trafiony typ dostajesz tyle punktów ile wynosił kurs bukmacherski. Za chybiony typ — 0 punktów." },
  { icon: "⭐", bg: "rgba(var(--gold-rgb),0.1)", title: "Gwiazdki za kolejkę", text: "Gracz z najwyższą sumą punktów w danej kolejce zdobywa gwiazdkę ⭐. Przy remisie gwiazdkę dostają wszyscy z najwyższym wynikiem. Licznik gwiazdek widoczny jest w rankingu." },
  { icon: "🏆", bg: "rgba(var(--accent-rgb),0.08)", title: "Klasyfikacja", text: "Wygrywa gracz z największą sumą punktów po zakończeniu sezonu — licząc wszystkie ligi razem. Ekstraklasa ma dodatkowo osobny ranking z nagrodą 100 zł." },
  { icon: "🔥", bg: "rgba(var(--loss-rgb),0.1)", title: "Mecz specjalny",
    text: "Przy wybranych hitach (np. El Clásico) zamiast 1, X lub 2 wpisujesz dokładny wynik. Trafiony dokładny wynik = kurs × 3, trafiony tylko zwycięzca albo remis = zwykły kurs, pudło = 0 pkt. Wynik możesz zmieniać do rozpoczęcia meczu." },
  { icon: "💰", bg: "rgba(var(--win-rgb),0.1)", title: "Pula z kuponów",
    text: `Admin stawia ${COUPON_STAKE} zł na każdy kupon ze Strefy kuponów. Gdy kupon wejdzie, wygrana po podatkach minus ${COUPON_STAKE} zł stawki trafia do puli nagród. Przegrane kupony najpierw odrabiamy: dopóki bilans wszystkich kuponów jest na minusie, wygrane zwracają adminowi postawione stawki, a do puli trafia dopiero nadwyżka. Bilans liczymy przez cały sezon, więc przegrany kupon zmniejsza pulę o ${COUPON_STAKE} zł. Na koniec sezonu pula dzieli się: 1. miejsce 35%, 2. miejsce 20%, 3. miejsce 10%, zwycięzca Ekstraklasy 35% — jako dodatek do nagród gwarantowanych, które się nie zmieniają. Liczą się tylko realne kupony, od weekendu ${weekendLabel(firstRealCouponWeekend())}.` },
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
    text: "Typy do wspólnego kuponu można dodawać do piątku do 12:00. Kursy na kuponie to kursy z piątku z 8:00 — późniejsze zmiany kuponu już nie ruszają. Gramy za 100 zł: bukmacher pobiera 12% podatku od stawki, więc w grze jest 88 zł. Od wygranej powyżej 2280 zł bukmacher potrąca dodatkowo 10% podatku." },
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
export default function RulesTab({ profiles, tips, matches, leagues, userId, couponPicks = [], couponOdds = {} }) {
  const { globalLb, ekstraLb } = useMemo(() => {
    const ekstraId = leagues.find(l => l.name === "Ekstraklasa")?.id;
    return {
      globalLb: buildLeaderboard(profiles, tips, matches, matches.map(m => m.id)),
      ekstraLb: buildLeaderboard(profiles, tips, matches, matches.filter(m => m.league_id === ekstraId).map(m => m.id)),
    };
  }, [profiles, tips, matches, leagues]);
  const ledger = useMemo(() => buildCouponLedger(couponPicks, couponMatchesById(matches, couponOdds)), [couponPicks, matches, couponOdds]);

  // Nagroda = kwota gwarantowana + udział w puli z kuponów
  const look = {
    p1: { name: "1. miejsce (wszystkie ligi)", color: "#ffd700", bg: "rgba(255,215,0,0.08)", leader: globalLb[0] },
    p2: { name: "2. miejsce (wszystkie ligi)", color: "#c0c0c0", bg: "rgba(192,192,192,0.08)", leader: globalLb[1] },
    p3: { name: "3. miejsce (wszystkie ligi)", color: "#cd7f32", bg: "rgba(205,127,50,0.08)", leader: globalLb[2] },
    ekstra: { name: "Klasyfikacja Ekstraklasy — 1. miejsce", color: "#f97316", bg: "rgba(249,115,22,0.08)", leader: ekstraLb[0] },
  };
  const prizes = ledger.prizes.map(p => ({ ...p, ...look[p.key] }));

  return (
    <>
      <div className="sh">Nagrody</div>
      <div className="rc" style={{ marginBottom: 10 }}>
        <div className="rp-pool">
          <span>💰 Pula z kuponów</span>
          <b>{zl(ledger.pool)}</b>
        </div>
        {prizes.map((r, i, arr) => (
          <div key={r.name} className="prow" style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(var(--ink-rgb),0.05)" : "none", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 12 }}>
              <div className="pic2" style={{ background: r.bg }}>{r.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="pnm">{r.name}</div>
                <div className="psub">
                  <span>{r.guaranteed} zł gwarancji</span> + <span><b>{zl(r.bonus)}</b> z puli ({Math.round(r.share * 100)}%)</span>
                </div>
              </div>
              <div className="pamt" style={{ color: r.color }}>{r.bonus > 0 ? money(r.total) : r.guaranteed}<span className="cur">zł</span></div>
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
