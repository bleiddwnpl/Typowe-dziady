import { useState, useEffect, useMemo } from "react";
import {
  PICK_LABELS, COUPON_MAX_PICKS, COUPON_SIZE, COUPON_MIN_VOTES, COUPON_TEST_UNTIL,
  COUPON_STAKE, STAKE_TAX, WIN_TAX, WIN_TAX_THRESHOLD, couponPayout, zl, money,
  currentCouponWeekend, isCouponOpen, isCouponTest, couponDeadlineKey, couponMatches, weekendLabel,
  buildCoupon, warsawNowKey, plural,
  couponMatchesById, buildCouponLedger, poolIfWon, firstRealCouponWeekend,
} from "../lib";
import { ClubAvatar } from "../components";

const HOW_KEY = "td-coupon-how-collapsed";
const STATUS = {
  live: { cls: "live", text: "● Kupon żyje" },
  won: { cls: "won", text: "✓ Kupon wszedł!" },
  lost: { cls: "dead", text: "✕ Kupon padł" },
  empty: { cls: "empty", text: "Brak kuponu" },
};
const ICON = { won: "✅", lost: "❌", pending: "⏳" };

// Czas do piątku 12:00 — liczony na zegarze Warszawy
function useCountdown(wk) {
  const [nowKey, setNowKey] = useState(warsawNowKey());
  useEffect(() => { const i = setInterval(() => setNowKey(warsawNowKey()), 30000); return () => clearInterval(i); }, []);
  const ms = Math.max(0, new Date(`${couponDeadlineKey(wk)}:00Z`) - new Date(`${nowKey}Z`));
  return { nowKey, days: Math.floor(ms / 86400000), hours: Math.floor((ms % 86400000) / 3600000), mins: Math.floor((ms % 3600000) / 60000) };
}

function TestTag({ wk }) {
  return isCouponTest(wk) ? <span className="cz-test">TEST</span> : null;
}

function HowItWorks() {
  const [collapsed, setCollapsed] = useState(() => { try { return localStorage.getItem(HOW_KEY) === "1"; } catch { return false; } });
  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem(HOW_KEY, next ? "1" : "0"); } catch { /* bez pamięci przeglądarki */ }
  };
  return (
    <div className="cz-card cz-how">
      <button className="cz-how-head" onClick={toggle} aria-expanded={!collapsed}>
        Jak to działa? <span>{collapsed ? "rozwiń ▼" : "zwiń ▲"}</span>
      </button>
      {!collapsed && (
        <ol>
          <li><span>Do <b>piątku 12:00</b> każdy może dorzucić <b>do {COUPON_MAX_PICKS} typów</b> z weekendowych meczów ligowych (bez Ligi Mistrzów).</span></li>
          <li><span>Typy kolegów są <b>ukryte do zamknięcia</b>, żeby każdy typował po swojemu.</span></li>
          <li><span>W piątek o 12:00 kupon <b>składa się sam z {COUPON_SIZE} najczęściej wybieranych typów</b>. Każdy musi mieć co najmniej {COUPON_MIN_VOTES} głosy.</span></li>
          <li><span>Remis w głosach rozstrzyga <b>niższy kurs</b>. Gdy na ten sam mecz są różne typy, na kupon trafia ten z większą liczbą głosów.</span></li>
          <li><span>W weekend <b>śledzimy kupon na żywo</b>. Jeśli padnie, zobaczysz, który mecz go zatopił.</span></li>
          <li><span>Gramy za <b>{COUPON_STAKE} zł</b>. Bukmacher pobiera {Math.round(STAKE_TAX * 100)}% podatku od stawki, więc w grze jest <b>{zl(couponPayout(1).inPlay)}</b>. Od wygranej powyżej {WIN_TAX_THRESHOLD} zł potrąca dodatkowo {Math.round(WIN_TAX * 100)}%.</span></li>
          <li><span>Zysk z wygranych kuponów trafia do <b>puli nagród sezonu</b>: 35% dla 1. miejsca, 20% dla 2., 10% dla 3. i 35% dla zwycięzcy Ekstraklasy — na dokładkę do nagród gwarantowanych. Przegrane kupony najpierw odrabiamy, żeby admin nie był stratny.</span></li>
          <li><span>Strefa kuponów <b>nie wpływa na punkty</b> w rankingu.</span></li>
        </ol>
      )}
    </div>
  );
}

// Pula nagród sezonu z wygranych kuponów
function PrizePool({ ledger }) {
  const started = ledger.played > 0 || ledger.live.length > 0;
  return (
    <div className="cz-card cz-pool">
      <div className="cz-pool-head">
        <div>
          <div className="cz-pool-l">💰 Pula nagród z kuponów</div>
          <div className="cz-pool-v">{money(ledger.pool)}<span className="cur">zł</span></div>
        </div>
        {ledger.played > 0 && (
          <div className="cz-pool-stats">
            <div>{ledger.played} {plural(ledger.played, "kupon", "kupony", "kuponów")}</div>
            <div><span className="w">✓ {ledger.won}</span> · <span className="x">✕ {ledger.lost}</span></div>
          </div>
        )}
      </div>
      <div className="cz-pool-split">
        {ledger.prizes.map(p => (
          <div key={p.key} className="cz-ps">
            <span className="e">{p.emoji}</span>
            <div className="n">{p.short}<span>{Math.round(p.share * 100)}%</span></div>
            <div className={`b ${p.bonus > 0 ? "on" : ""}`}>+{money(p.bonus)} zł</div>
          </div>
        ))}
      </div>
      <div className="cz-pool-note">
        {ledger.adminDebt > 0
          ? <>Kolejne wygrane najpierw zwrócą adminowi <b>{zl(ledger.adminDebt)}</b> postawionych stawek, potem rośnie pula.</>
          : !started
            ? <>Liczymy od pierwszego realnego kuponu ({weekendLabel(firstRealCouponWeekend())}). Kupony testowe nie wchodzą do puli.</>
            : <>Pulę dzielimy na koniec sezonu, na dokładkę do nagród gwarantowanych.</>}
      </div>
    </div>
  );
}

// Co kupon zmienia w puli (tylko realne kupony)
function PoolNote({ wk, coupon, ledger }) {
  if (coupon.status === "empty") return null;
  if (isCouponTest(wk)) return <div className="cz-poolnote">🧪 Kupon testowy — nie wpływa na pulę nagród.</div>;
  if (coupon.status === "live") {
    const net = couponPayout(coupon.totalOdds).net;
    const toPool = poolIfWon(ledger, coupon.totalOdds);
    const toAdmin = Math.max(0, Math.min(ledger.adminDebt, net - COUPON_STAKE));
    return (
      <div className="cz-poolnote">
        💰 Jeśli wejdzie: {toAdmin > 0 && <>{zl(toAdmin)} wraca do admina, </>}
        <b className="up">+{zl(toPool)}</b> do puli nagród
      </div>
    );
  }
  const e = ledger.byWeekend[wk];
  if (!e) return null;
  const toAdmin = Math.round((e.delta - e.poolChange) * 100) / 100;
  return (
    <div className="cz-poolnote">
      {e.poolChange > 0 ? <>💰 Do puli nagród: <b className="up">+{zl(e.poolChange)}</b>{toAdmin > 0 && <> · najpierw {zl(toAdmin)} zwrotu stawek dla admina</>}</>
        : e.poolChange < 0 ? <>💰 Pula nagród: <b className="down">− {zl(-e.poolChange)}</b></>
        : e.delta > 0 ? <>💰 Cała wygrana ponad stawkę wraca do admina: {zl(e.delta)}</>
        : <>💰 Bilans kuponu: <b className="down">− {zl(-e.delta)}</b> — admin odrobi to z kolejnych wygranych</>}
    </div>
  );
}

// Kupon złożony (bieżący po terminie albo z historii)
function CouponCard({ wk, number, coupon, userId, myPicks, profiles, ledger }) {
  const pay = couponPayout(coupon.totalOdds);
  const st = STATUS[coupon.status];
  const name = id => profiles.find(p => p.id === id)?.name || "?";
  const mineOnCoupon = coupon.events.filter(e => e.voters.includes(userId)).length;
  return (
    <div className="cz-card">
      <div className="cz-slip-head">
        <div>
          <div className="cz-title">Kupon weekendu #{number}<TestTag wk={wk} /></div>
          <div className="cz-sub">{weekendLabel(wk)}</div>
        </div>
        <span className={`cz-status ${st.cls}`}>{st.text}</span>
      </div>

      {coupon.status === "empty" ? (
        <div className="cz-rule">Żaden typ nie zebrał {COUPON_MIN_VOTES} głosów, więc w ten weekend kupon nie powstał.</div>
      ) : (
        <>
          {coupon.events.map(e => (
            <div key={e.match_id} className={`cz-ev ${coupon.killer?.match_id === e.match_id ? "killer" : ""}`}>
              <div className="st">{ICON[e.status]}</div>
              <div style={{ minWidth: 0 }}>
                <div className="m">{e.match.home} – {e.match.away}</div>
                <div className="d">
                  {PICK_LABELS[e.pick]} · {e.voters.length} {plural(e.voters.length, "głos", "głosy", "głosów")}
                  {e.status === "pending" ? ` · ${e.match.match_date.slice(8, 10)}.${e.match.match_date.slice(5, 7)} ${e.match.match_time?.slice(0, 5)}` : ""}
                  {e.status === "lost" ? ` · wynik: ${PICK_LABELS[e.match.result]}` : ""}
                </div>
              </div>
              <div className="o">{e.odds.toFixed(2)}</div>
            </div>
          ))}
          <div className="cz-totals">
            <div className="cz-tot"><div className="l">Łączny kurs</div><div className="v">{pay.odds.toFixed(2)}</div></div>
            <div className="cz-tot"><div className="l">{coupon.status === "won" ? "Wypłata" : "Do wygrania"}</div><div className={`v ${coupon.status === "lost" ? "lost" : "win"}`}>{money(pay.net)}<span className="cur">zł</span></div></div>
          </div>
          <div className="cz-pay">
            <div><span>Stawka</span><span>{zl(pay.stake)}</span></div>
            <div><span>Podatek od stawki {Math.round(STAKE_TAX * 100)}%</span><span>− {zl(pay.stakeTax)}</span></div>
            <div><span>W grze</span><span>{zl(pay.inPlay)}</span></div>
            <div><span>Wygrana ({zl(pay.inPlay)} × {pay.odds.toFixed(2)})</span><span>{zl(pay.gross)}</span></div>
            {pay.winTax > 0 && <div><span>Podatek od wygranej {Math.round(WIN_TAX * 100)}% (powyżej {WIN_TAX_THRESHOLD} zł)</span><span>− {zl(pay.winTax)}</span></div>}
            <div className="sum"><span>Do wypłaty</span><span>{zl(pay.net)}</span></div>
          </div>
          <PoolNote wk={wk} coupon={coupon} ledger={ledger} />
          {coupon.killer && (
            <div className="cz-kill">
              🔪 <b>Zabójca kuponu: {coupon.killer.match.home} – {coupon.killer.match.away}</b><br />
              Na typ {PICK_LABELS[coupon.killer.pick]} głosowali: {coupon.killer.voters.map(name).join(", ")}
            </div>
          )}
        </>
      )}
      <div className="cz-rule">
        Typy zebrane od {coupon.participants} {plural(coupon.participants, "osoby", "osób", "osób")}, razem {coupon.picksCount}.
        {myPicks > 0 && coupon.events.length > 0 ? ` Twoje typy na kuponie: ${mineOnCoupon} z ${coupon.events.length}.` : ""}
      </div>
    </div>
  );
}

// ── STREFA KUPONÓW ────────────────────────────────────────────────────────────
export default function CouponTab({ matches, leagues, profiles, couponPicks, couponParticipants, couponOdds = {}, userId, onToggle, onReload }) {
  const wk = currentCouponWeekend();
  const { nowKey, days, hours, mins } = useCountdown(wk);
  const open = isCouponOpen(wk, nowKey);
  // Kupon po terminie liczymy z kursów zamrożonych w piątek o 12:00 (późniejsze zmiany go nie ruszają)
  const matchesById = useMemo(() => couponMatchesById(matches, couponOdds), [matches, couponOdds]);
  const ledger = useMemo(() => buildCouponLedger(couponPicks, matchesById, nowKey), [couponPicks, matchesById, nowKey]);

  // Po zamknięciu baza odsłania typy kolegów — dociągamy je
  useEffect(() => { onReload?.(); }, [open]); // eslint-disable-line

  const available = useMemo(() => couponMatches(matches, leagues, wk), [matches, leagues, wk]);
  const myPicks = couponPicks.filter(p => p.user_id === userId && p.weekend === wk);
  const myPickFor = id => myPicks.find(p => p.match_id === id);
  const participants = couponParticipants.filter(p => p.weekend === wk);
  const leagueName = id => leagues.find(l => l.id === id)?.name || "";

  // Numeracja i historia kuponów (tylko zamknięte weekendy)
  const closedWeekends = useMemo(() => {
    const set = new Set(couponPicks.map(p => p.weekend).filter(w => !isCouponOpen(w, nowKey)));
    return [...set].sort();
  }, [couponPicks, nowKey]);
  const numberOf = w => closedWeekends.indexOf(w) + 1;
  const couponFor = w => buildCoupon(couponPicks.filter(p => p.weekend === w), matchesById);
  const history = closedWeekends.filter(w => w !== wk).reverse();

  const days_ = useMemo(() => {
    const out = [];
    available.forEach(m => {
      const last = out[out.length - 1];
      if (last && last.date === m.match_date) last.matches.push(m); else out.push({ date: m.match_date, matches: [m] });
    });
    return out;
  }, [available]);
  const dayTitle = iso => {
    const s = new Date(`${iso}T12:00:00Z`).toLocaleDateString("pl-PL", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" });
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <>
      {nowKey < `${COUPON_TEST_UNTIL}T00:00` && (
        <div className="cz-testbar">
          <span className="i">🧪</span>
          <div><b>Październik to miesiąc testowy.</b> Kupony są na niby — sprawdzamy, jak działa wspólne typowanie i czy wszystkim pasują zasady. <b>Od listopada gramy realne kupony.</b></div>
        </div>
      )}

      {open ? (
        <>
          <div className="cz-card">
            <div className="cz-hero">
              <div className="cz-title">Kupon weekendu<TestTag wk={wk} /></div>
              <div className="cz-sub">Mecze {weekendLabel(wk)} · wszystkie ligi poza LM · stawka {COUPON_STAKE} zł</div>
              <div className="cz-countdown">
                <div className="cz-cd"><div className="v">{days}</div><div className="l">{plural(days, "dzień", "dni", "dni")}</div></div>
                <div className="cz-cd"><div className="v">{String(hours).padStart(2, "0")}</div><div className="l">godz.</div></div>
                <div className="cz-cd"><div className="v">{String(mins).padStart(2, "0")}</div><div className="l">min</div></div>
              </div>
            </div>
            <div className="cz-meter">
              <span>Twoje typy: <b>{myPicks.length} z {COUPON_MAX_PICKS}</b></span>
              <div className="cz-bar"><div style={{ width: `${(myPicks.length / COUPON_MAX_PICKS) * 100}%` }} /></div>
            </div>
            <div className="cz-people">
              {participants.length > 0 ? (
                <>
                  <div className="cz-stack">
                    {participants.slice(0, 6).map(p => {
                      const pr = profiles.find(x => x.id === p.user_id);
                      return <ClubAvatar key={p.user_id} favoriteTeam={pr?.favorite_team} name={pr?.name || "?"} size={24} />;
                    })}
                  </div>
                  {participants.length} {plural(participants.length, "osoba już dorzuciła", "osoby już dorzuciły", "osób już dorzuciło")} typy
                </>
              ) : "Nikt jeszcze nie dorzucił typów — bądź pierwszy"}
            </div>
          </div>

          <PrizePool ledger={ledger} />
          <HowItWorks />

          {available.length === 0 && (
            <div className="empty">
              <div className="ei">📅</div>
              <div className="et">Brak meczów na ten weekend</div>
              <div className="es">Pojawią się tutaj, gdy admin doda mecze.</div>
            </div>
          )}

          {days_.map(day => (
            <div key={day.date}>
              <div className="cz-day">{dayTitle(day.date)}</div>
              {day.matches.map(m => {
                const mine = myPickFor(m.id);
                return (
                  <div key={m.id} className={`cz-row ${mine ? "picked" : ""}`}>
                    <div className="cz-rtop">
                      <span>{leagueName(m.league_id)} · {m.match_time?.slice(0, 5)}</span>
                      {mine && <span className="mine">✓ Twój typ</span>}
                    </div>
                    <div className="cz-teams">{m.home}<small>–</small>{m.away}</div>
                    <div className="cz-picks">
                      {["home", "draw", "away"].map(pick => (
                        <button key={pick} className={`cz-pk ${mine?.pick === pick ? "sel" : ""}`}
                          onClick={() => onToggle(m, pick, wk, COUPON_MAX_PICKS)} aria-pressed={mine?.pick === pick}>
                          <span className="t">{PICK_LABELS[pick]}</span>
                          <span className="v">{parseFloat(m[`odds_${pick}`]).toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          {available.length > 0 && <div className="cz-hint">Zmiana typu: dotknij inny kurs. Usunięcie: dotknij ten sam jeszcze raz.</div>}
        </>
      ) : (
        closedWeekends.includes(wk)
          ? <CouponCard wk={wk} number={numberOf(wk)} coupon={couponFor(wk)} userId={userId} myPicks={myPicks.length} profiles={profiles} ledger={ledger} />
          : (
            <div className="empty">
              <div className="ei">🧾</div>
              <div className="et">W ten weekend nikt nie dorzucił typów</div>
              <div className="es">Kolejna szansa od wtorku — wtedy otworzy się następny weekend.</div>
            </div>
          )
      )}
      {!open && <PrizePool ledger={ledger} />}

      {history.length > 0 && <>
        <div className="sh" style={{ marginTop: 16 }}>Poprzednie kupony</div>
        <div className="cz-card">
          {history.map(w => {
            const c = couponFor(w);
            const won = c.events.filter(e => e.status === "won").length;
            const desc = c.status === "won" ? `Wszedł! Kurs ${couponPayout(c.totalOdds).odds.toFixed(2)} → ${zl(couponPayout(c.totalOdds).net)} do wypłaty`
              : c.status === "lost" ? `Padł na ${c.killer.match.home} – ${c.killer.match.away} · ${won} z ${c.events.length} trafionych`
              : c.status === "empty" ? "Kupon nie powstał" : "Jeszcze się rozstrzyga";
            const e = ledger.byWeekend[w];
            return (
              <div key={w} className="cz-hist">
                <div style={{ minWidth: 0 }}>
                  <div>#{numberOf(w)} · {weekendLabel(w)}<TestTag wk={w} /></div>
                  <div className="d">{desc}</div>
                </div>
                <div className="cz-hist-r">
                  {e?.delta !== undefined && <span className={`amt ${e.delta >= 0 ? "up" : "down"}`}>{e.delta >= 0 ? "+" : "−"}{money(Math.abs(e.delta))} zł</span>}
                  <span className={`cz-hist-icon ${c.status}`}>{c.status === "won" ? "✓" : c.status === "lost" ? "✕" : "–"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </>}
    </>
  );
}
