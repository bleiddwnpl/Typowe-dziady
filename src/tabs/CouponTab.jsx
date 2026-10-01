import { useState, useEffect, useMemo } from "react";
import {
  PICK_LABELS, COUPON_MAX_PICKS, COUPON_SIZE, COUPON_MIN_VOTES, COUPON_TEST_UNTIL,
  currentCouponWeekend, isCouponOpen, isCouponTest, couponDeadlineKey, couponMatches, weekendLabel,
  buildCoupon, warsawNowKey, plural,
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
          <li><span>Strefa kuponów <b>nie wpływa na punkty</b> w rankingu.</span></li>
        </ol>
      )}
    </div>
  );
}

// Kupon złożony (bieżący po terminie albo z historii)
function CouponCard({ wk, number, coupon, userId, myPicks, profiles }) {
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
            <div className="cz-tot"><div className="l">Łączny kurs</div><div className="v">{coupon.totalOdds.toFixed(2)}</div></div>
            <div className="cz-tot"><div className="l">Kupon za 10 zł</div><div className={`v ${coupon.status === "lost" ? "lost" : "win"}`}>{Math.round(coupon.totalOdds * 10)} zł</div></div>
          </div>
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
export default function CouponTab({ matches, leagues, profiles, couponPicks, couponParticipants, userId, onToggle, onReload }) {
  const wk = currentCouponWeekend();
  const { nowKey, days, hours, mins } = useCountdown(wk);
  const open = isCouponOpen(wk, nowKey);
  const matchesById = useMemo(() => new Map(matches.map(m => [m.id, m])), [matches]);

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
              <div className="cz-sub">Mecze {weekendLabel(wk)} · wszystkie ligi poza LM</div>
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
          ? <CouponCard wk={wk} number={numberOf(wk)} coupon={couponFor(wk)} userId={userId} myPicks={myPicks.length} profiles={profiles} />
          : (
            <div className="empty">
              <div className="ei">🧾</div>
              <div className="et">W ten weekend nikt nie dorzucił typów</div>
              <div className="es">Kolejna szansa od wtorku — wtedy otworzy się następny weekend.</div>
            </div>
          )
      )}

      {history.length > 0 && <>
        <div className="sh" style={{ marginTop: 16 }}>Poprzednie kupony</div>
        <div className="cz-card">
          {history.map(w => {
            const c = couponFor(w);
            const won = c.events.filter(e => e.status === "won").length;
            const desc = c.status === "won" ? `Wszedł! Kurs ${c.totalOdds.toFixed(2)} → ${Math.round(c.totalOdds * 10)} zł za 10 zł`
              : c.status === "lost" ? `Padł na ${c.killer.match.home} – ${c.killer.match.away} · ${won} z ${c.events.length} trafionych`
              : c.status === "empty" ? "Kupon nie powstał" : "Jeszcze się rozstrzyga";
            return (
              <div key={w} className="cz-hist">
                <div style={{ minWidth: 0 }}>
                  <div>#{numberOf(w)} · {weekendLabel(w)}<TestTag wk={w} /></div>
                  <div className="d">{desc}</div>
                </div>
                <span className={`cz-hist-icon ${c.status}`}>{c.status === "won" ? "✓" : c.status === "lost" ? "✕" : "–"}</span>
              </div>
            );
          })}
        </div>
      </>}
    </>
  );
}
