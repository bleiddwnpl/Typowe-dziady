import { useState, useEffect, useRef } from "react";
import { TEAM_LOGOS, TEAMS_BY_LEAGUE, FEATURED_TEAMS, PICK_LABELS, getAvatar, getTeamsForLeague, getFeaturedTeam, isMatchLocked, plural, formatDate, oddsTrend, normalizeNick, NICK_MIN, NICK_MAX, NICK_DAYS } from "./lib";

// Wspólne elementy interfejsu używane przez kilka zakładek

// ── LOGO KLUBU I AVATAR ───────────────────────────────────────────────────────
export function TeamLogo({ name, size = 32 }) {
  const logo = TEAM_LOGOS[name];
  const av = getAvatar(name);
  if (logo) return (
    <img src={logo} alt={name} style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />
  );
  return <div style={{ width: size, height: size, borderRadius: "50%", background: av.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 700, color: "var(--ink)", flexShrink: 0 }}>{av.initials}</div>;
}

export function ClubAvatar({ favoriteTeam, name, size = 32 }) {
  const av = getAvatar(name);
  const logo = favoriteTeam ? TEAM_LOGOS[favoriteTeam] : null;
  if (logo) return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "rgba(0,0,0,0.3)", border: "1.5px solid rgba(var(--accent-rgb),0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
      <img src={logo} alt={favoriteTeam} style={{ width: size * 0.72, height: size * 0.72, objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} />
    </div>
  );
  return <div style={{ width: size, height: size, borderRadius: "50%", background: av.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 700, color: "var(--ink)", flexShrink: 0 }}>{av.initials}</div>;
}

// ── FORMULARZ MECZU ───────────────────────────────────────────────────────────
export function MatchFormFields({ data, onChange, leagues }) {
  const lgName = leagues.find(l => l.id === data.league_id)?.name || "";
  const teams = getTeamsForLeague(lgName);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <select className="msel" value={data.league_id} onChange={e => onChange({ ...data, league_id: e.target.value, home: "", away: "" })}>
        <option value="">Wybierz ligę</option>
        {leagues.map(l => <option key={l.id} value={l.id}>{l.flag} {l.name}</option>)}
      </select>
      <div style={{ display: "flex", gap: 8 }}>
        <select className="msel" style={{ marginBottom: 0 }} value={data.home} onChange={e => onChange({ ...data, home: e.target.value })}>
          <option value="">Gospodarz</option>
          {teams.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="msel" style={{ marginBottom: 0 }} value={data.away} onChange={e => onChange({ ...data, away: e.target.value })}>
          <option value="">Gość</option>
          {teams.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="mi" style={{ marginBottom: 0 }} type="date" value={data.match_date} onChange={e => onChange({ ...data, match_date: e.target.value })} />
        <input className="mi" style={{ marginBottom: 0 }} type="time" value={data.match_time} onChange={e => onChange({ ...data, match_time: e.target.value })} />
      </div>
      <input className="mi" style={{ marginBottom: 0 }} placeholder="Kolejka (np. Kolejka 1)" value={data.round} onChange={e => onChange({ ...data, round: e.target.value })} />
      <div style={{ display: "flex", gap: 8 }}>
        <input className="mi" style={{ marginBottom: 0 }} type="number" step="0.01" min="1" placeholder="Kurs 1" value={data.odds_home} onChange={e => onChange({ ...data, odds_home: e.target.value })} />
        <input className="mi" style={{ marginBottom: 0 }} type="number" step="0.01" min="1" placeholder="Kurs X" value={data.odds_draw} onChange={e => onChange({ ...data, odds_draw: e.target.value })} />
        <input className="mi" style={{ marginBottom: 0 }} type="number" step="0.01" min="1" placeholder="Kurs 2" value={data.odds_away} onChange={e => onChange({ ...data, odds_away: e.target.value })} />
      </div>
    </div>
  );
}

// ── ZAMYKANIE OKIEN: przycisk Wstecz w telefonie i klawisz Esc ─────────────────
// Wywołaj w komponencie okna (montowanym tylko, gdy okno jest otwarte).
// Otwarcie dodaje wpis do historii przeglądarki, więc „Wstecz” zamyka okno zamiast wychodzić ze strony.
export function useSheetClose(onClose) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const id = Math.random().toString(36).slice(2);
    window.history.pushState({ ...(window.history.state || {}), tdSheet: id }, "");
    let closedByBack = false;
    const onPop = () => { closedByBack = true; closeRef.current(); };
    const onKey = e => { if (e.key === "Escape") closeRef.current(); };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
      // Zamknięte przyciskiem w aplikacji → usuń nasz wpis z historii
      if (!closedByBack && window.history.state?.tdSheet === id) window.history.back();
    };
  }, []);
}

// Mała strzałka przy kursie: ▲ kurs wzrósł, ▼ spadł od dodania meczu
export function OddsTrend({ match, pick }) {
  const t = oddsTrend(match, pick);
  if (!t) return null;
  return <span className={`otr ${t.dir}`} title={`Kurs ${t.dir === "up" ? "wzrósł" : "spadł"} z ${t.from.toFixed(2)}`}>{t.dir === "up" ? "▲" : "▼"}</span>;
}

// ── TEAM PICKER ───────────────────────────────────────────────────────────────
export function TeamPicker({ onSave, onSkip }) {
  const [sel, setSel] = useState(null);
  useSheetClose(onSkip);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", backdropFilter: "blur(20px)" }}>
      <div style={{ background: "var(--bg-raised)", border: "1px solid rgba(var(--ink-rgb),0.1)", borderRadius: "28px 28px 0 0", padding: "28px 20px 48px", width: "100%", maxWidth: 480, maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div style={{ width: 36, height: 4, background: "rgba(var(--ink-rgb),0.15)", borderRadius: 2, margin: "0 auto 20px" }} />
        <div className="mtt" style={{ textAlign: "center" }}>Twój ulubiony klub</div>
        <div style={{ fontSize: 12, color: "rgba(var(--ink-rgb),0.4)", textAlign: "center", marginBottom: 18 }}>Logo pojawi się przy Twoim nicku w rankingu i czacie</div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {Object.entries(TEAMS_BY_LEAGUE).map(([lgName, teams]) => (
            <div key={lgName}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(var(--ink-rgb),0.3)", letterSpacing: 2, textTransform: "uppercase", padding: "10px 4px 6px" }}>{lgName}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 8 }}>
                {Object.entries(teams).map(([name, logo]) => (
                  <button type="button" className="picker-tile" key={name} onClick={() => setSel(name)} aria-pressed={sel === name}
                    style={{ background: sel === name ? "rgba(var(--accent-rgb),0.15)" : "rgba(var(--ink-rgb),0.04)", border: `1.5px solid ${sel === name ? "var(--accent)" : "rgba(var(--ink-rgb),0.08)"}`, borderRadius: 12, padding: "10px 6px", textAlign: "center", cursor: "pointer", transition: "all 0.18s" }}>
                    <img src={logo} alt={name} style={{ width: 36, height: 36, objectFit: "contain", display: "block", margin: "0 auto 5px" }} onError={e => { e.target.style.opacity = "0.2"; }} />
                    <div style={{ fontSize: 10, color: sel === name ? "var(--accent-light)" : "rgba(var(--ink-rgb),0.5)", fontWeight: 600, lineHeight: 1.2 }}>{name}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => onSave(sel)} disabled={!sel} style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,var(--accent-deep),var(--accent))", border: "none", borderRadius: 14, color: "var(--ink)", fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: sel ? "pointer" : "not-allowed", marginTop: 14, opacity: sel ? 1 : 0.35 }}>Zapisz wybór →</button>
        <button onClick={onSkip} style={{ width: "100%", padding: 10, background: "transparent", border: "none", color: "rgba(var(--ink-rgb),0.3)", fontFamily: "inherit", fontSize: 13, cursor: "pointer", marginTop: 6 }}>Pomiń na razie</button>
      </div>
    </div>
  );
}

// ── TIP DISTRIBUTION ─────────────────────────────────────────────────────────
// stats = { home, draw, away } — same liczby z bazy, bez informacji kto co wybrał
export function TipDistribution({ stats }) {
  const total = stats ? stats.home + stats.draw + stats.away : 0;
  if (total === 0) return null;
  const h = Math.round((stats.home / total) * 100);
  const d = Math.round((stats.draw / total) * 100);
  const a = 100 - h - d;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 10 }}>
      <div style={{ display: "flex", height: 8, borderRadius: 8, overflow: "hidden", gap: 2 }}>
        <div style={{ width: `${h}%`, background: "var(--win)", borderRadius: "8px 0 0 8px", transition: "width 0.4s" }} />
        <div style={{ width: `${d}%`, background: "rgba(var(--ink-rgb),0.25)", transition: "width 0.4s" }} />
        <div style={{ width: `${a}%`, background: "var(--loss)", borderRadius: "0 8px 8px 0", transition: "width 0.4s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {[["var(--win)","Gosp.",h],["rgba(var(--ink-rgb),0.5)","Remis",d],["var(--loss)","Gość",a]].map(([color,label,pct]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: "rgba(var(--ink-rgb),0.45)", fontWeight: 700 }}>{label}</span>
            <span style={{ fontSize: 11, fontWeight: 800, color }}>&nbsp;{pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── POLL CARD ─────────────────────────────────────────────────────────────────
export function PollCard({ poll, options, votes, userId, onVote }) {
  const myVote = votes.find(v => v.poll_id === poll.id && v.user_id === userId);
  const totalVotes = votes.filter(v => v.poll_id === poll.id).length;
  const closed = poll.status === "closed";
  return (
    <div style={{ background: "rgba(var(--poll-rgb),0.04)", border: "1px solid rgba(var(--poll-rgb),0.15)", borderRadius: 20, marginBottom: 12, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", background: "rgba(var(--poll-rgb),0.06)", borderBottom: "1px solid rgba(var(--poll-rgb),0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--poll)", background: "rgba(var(--poll-rgb),0.1)", border: "1px solid rgba(var(--poll-rgb),0.2)", padding: "3px 10px", borderRadius: 20 }}>🗳️ ANKIETA</span>
        <span style={{ fontSize: 11, color: "rgba(var(--ink-rgb),0.35)", fontWeight: 600 }}>{totalVotes} {plural(totalVotes, "głos", "głosy", "głosów")}{closed ? " · Zamknięta" : ""}</span>
      </div>
      <div style={{ padding: "14px 14px 12px" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 12, lineHeight: 1.4 }}>{poll.question}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {options.filter(o => o.poll_id === poll.id).map(opt => {
            const optVotes = votes.filter(v => v.poll_id === poll.id && v.option_id === opt.id).length;
            const pct = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
            const isMyVote = myVote?.option_id === opt.id;
            const showBar = !!myVote || closed;
            return (
              <button key={opt.id} onClick={() => !myVote && !closed && onVote(poll.id, opt.id)} disabled={!!myVote || closed}
                style={{ width: "100%", padding: "10px 14px", background: isMyVote ? "rgba(var(--poll-rgb),0.12)" : "rgba(var(--ink-rgb),0.04)", border: `1.5px solid ${isMyVote ? "var(--poll)" : "rgba(var(--ink-rgb),0.1)"}`, borderRadius: 12, cursor: myVote || closed ? "default" : "pointer", position: "relative", overflow: "hidden", textAlign: "left", fontFamily: "inherit", transition: "all 0.2s" }}>
                {showBar && <div style={{ position: "absolute", inset: 0, background: isMyVote ? "rgba(var(--poll-rgb),0.08)" : "rgba(var(--ink-rgb),0.03)", width: `${pct}%`, transition: "width 0.5s ease" }} />}
                <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: isMyVote ? 700 : 500, color: isMyVote ? "#c4b5fd" : "var(--ink)" }}>{isMyVote && "✓ "}{opt.label}</span>
                  {showBar && <span style={{ fontSize: 12, fontWeight: 700, color: isMyVote ? "var(--poll)" : "rgba(var(--ink-rgb),0.4)" }}>{pct}%</span>}
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: myVote ? "var(--poll)" : "rgba(var(--ink-rgb),0.3)", fontWeight: myVote ? 600 : 400, textAlign: "center" }}>
          {myVote ? "Twoja opinia została zapisana ✓" : !closed ? "Zagłosuj — wyniki pojawią się po oddaniu głosu" : "Ankieta zamknięta"}
        </div>
      </div>
    </div>
  );
}

// ── ODSŁONIĘTE TYPY (po rozpoczęciu meczu) ────────────────────────────────────
export function PickReveal({ match, tips, profiles, userId }) {
  const matchTips = tips.filter(t => t.match_id === match.id);
  const byPick = { home: [], draw: [], away: [] };
  matchTips.forEach(t => {
    const p = profiles.find(pr => pr.id === t.user_id);
    if (p && byPick[t.pick]) byPick[t.pick].push(p);
  });
  const tipped = new Set(matchTips.map(t => t.user_id));
  const missing = profiles.filter(p => !tipped.has(p.id));
  const finished = match.status === "finished";
  const cols = [["home", "var(--win)"], ["draw", "rgba(var(--ink-rgb),0.6)"], ["away", "var(--loss)"]];

  return (
    <>
      <div className="picks">
        {cols.map(([pick, color]) => {
          const list = byPick[pick];
          const isWin = finished && pick === match.result;
          return (
            <div key={pick} className={`pcol ${finished ? (isWin ? "win" : "lose") : ""}`}>
              <h4 style={{ color }}>{PICK_LABELS[pick]}{isWin ? " ✓" : ""} · {list.length}</h4>
              {list.length === 0 ? <div className="pnone">—</div> : list.map(p => (
                <div key={p.id} className={`pwho ${p.id === userId ? "me" : ""}`}>
                  <ClubAvatar favoriteTeam={p.favorite_team} name={p.name} size={18} />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {!finished && missing.length > 0 && <div className="pmissing">Bez typu: {missing.map(p => p.name).join(", ")}</div>}
    </>
  );
}

// Informacja przed meczem, kiedy typy się odsłonią
function PicksHidden({ match }) {
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Warsaw" }).format(new Date());
  const time = match.match_time?.slice(0, 5);
  const when = match.match_date === today ? `o ${time}` : `${formatDate(match.match_date)} o ${time}`;
  return <div className="picks-hidden">🔒 Typy graczy odsłonią się {when}</div>;
}

// ── KARTA NADCHODZĄCEGO MECZU ─────────────────────────────────────────────────
// Sama wybiera wygląd: zwykła karta albo duża karta wyróżnionego klubu
export function MatchCard({ match, tip, stats, tips, profiles, userId, onTip, onLocked }) {
  const lck = isMatchLocked(match);
  const featured = getFeaturedTeam(match, tip?.pick);

  // Po gwizdku dociągamy typy wszystkich graczy tego meczu
  useEffect(() => { if (lck) onLocked?.(match.id); }, [lck, match.id]); // eslint-disable-line

  const missing = !tip && !lck;
  const bottom = (
    <>
      {lck && <div className="lck">⛔ Typowanie zamknięte</div>}
      <TipDistribution stats={stats} />
      {lck ? <PickReveal match={match} tips={tips} profiles={profiles} userId={userId} /> : <PicksHidden match={match} />}
    </>
  );

  if (featured) return <FeaturedMatchCard match={match} tip={tip} onTip={onTip} lck={lck} featured={featured} missing={missing} bottom={bottom} />;

  return (
    <div className={`mc ${missing ? "missing" : ""}`}>
      <div className="mt2">
        <span className="rbadge">{match.round}</span>
        <span className="mtime">{formatDate(match.match_date)} · {match.match_time?.slice(0, 5)}</span>
      </div>
      <div className="mb2">
        <div className="tms">
          <div className="tm"><TeamLogo name={match.home} size={30} /><span className="tn">{match.home}</span></div>
          <div className="vs-sep"><span className="vs-txt">VS</span></div>
          <div className="tm r"><TeamLogo name={match.away} size={30} /><span className="tn">{match.away}</span></div>
        </div>
        <div className="odds">
          {["home", "draw", "away"].map(pick => (
            <button key={pick} className={`odd ${tip?.pick === pick && !lck ? "sel" : ""} ${lck && tip?.pick !== pick ? "no" : ""}`} onClick={() => onTip(match.id, pick)} disabled={lck}>
              <div className="ol">{PICK_LABELS[pick]}</div>
              <div className="ov">{parseFloat(match[`odds_${pick}`]).toFixed(2)}</div>
              <OddsTrend match={match} pick={pick} />
            </button>
          ))}
        </div>
        {!lck && tip && <div className="tipok">✓ Typ: {PICK_LABELS[tip.pick]} · +{parseFloat(match[`odds_${tip.pick}`]).toFixed(2)} pkt</div>}
        {bottom}
      </div>
    </div>
  );
}

// Jedna strona meczu na dużej karcie. Gospodarz: herb → nazwa. Gość: nazwa → herb.
// highlight = drużyna podświetlona w barwach z ft (przy remisie obie, każda w swoich).
function FeaturedSide({ team, highlight, ft, nameFirst, compact }) {
  const size = highlight ? 44 : 40;
  // Nazwy wielowyrazowe w dwóch liniach: pierwszy wyraz u góry, reszta pod spodem (np. REAL / MADRID)
  const [first, ...rest] = team.toUpperCase().split(" ");
  const lines = rest.length ? [first, rest.join(" ")] : [first];
  const longest = Math.max(...lines.map(s => s.length));
  const fontSize = longest > 10 ? 18 : compact ? 21 : highlight ? 24 : 20;
  const logo = (
    <img src={TEAM_LOGOS[team]} alt={team}
      style={{ width: size, height: size, objectFit: "contain", flexShrink: 0, filter: highlight ? `drop-shadow(0 2px 10px rgba(${ft.colorRgb},0.6))` : "drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }} />
  );
  const name = (
    <span style={{ display: "flex", flexDirection: "column", alignItems: nameFirst ? "flex-end" : "flex-start", minWidth: 0,
      fontFamily: "'Bebas Neue',sans-serif", fontSize, lineHeight: 1, color: highlight ? ft.textColor : "var(--ink)", letterSpacing: 0.5,
      textShadow: highlight ? `0 0 20px rgba(${ft.colorRgb},0.5)` : "none", textAlign: nameFirst ? "right" : "left" }}>
      {lines.map(line => <span key={line} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>{line}</span>)}
    </span>
  );
  return <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>{nameFirst ? <>{name}{logo}</> : <>{logo}{name}</>}</div>;
}

// Remis przy dwóch klubach ze zdjęciem: karta podzielona po skosie.
// Każde zdjęcie ma własną połówkę (58% szerokości, nachodzą na siebie pod skosem) i jest w niej wyśrodkowane.
const DRAW_ACCENT = { color: "#e9eef2", colorRgb: "220,225,230", textColor: "#ffffff", bgDark: "#141413" };

function SplitPhotos({ homeFt, awayFt }) {
  const layer = { position: "absolute", top: 0, bottom: 0, width: "58%", backgroundSize: "cover", filter: "brightness(0.45) saturate(1.3)" };
  return (
    <>
      <div style={{ ...layer, left: 0, backgroundImage: `url('${homeFt.photo}')`, backgroundPosition: "43% center", clipPath: "polygon(0 0, 100% 0, 72.41% 100%, 0 100%)" }} />
      <div style={{ ...layer, right: 0, backgroundImage: `url('${awayFt.photo}')`, backgroundPosition: "57% center", clipPath: "polygon(27.59% 0, 100% 0, 100% 100%, 0 100%)" }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="58" y1="0" x2="42" y2="100" stroke="rgba(255,255,255,0.7)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
      </svg>
    </>
  );
}

function FeaturedMatchCard({ match, tip, onTip, lck, featured, missing, bottom }) {
  const homeFt = FEATURED_TEAMS[match.home], awayFt = FEATURED_TEAMS[match.away];
  const split = tip?.pick === "draw" && !!homeFt && !!awayFt;
  const ft = split ? DRAW_ACCENT : FEATURED_TEAMS[featured];
  const chip = { background: "rgba(0,0,0,0.5)", color: "rgba(var(--ink-rgb),0.85)", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, backdropFilter: "blur(6px)" };

  // Ramka: przy remisie przejście z barw gospodarza w barwy gości
  const outer = split
    ? { borderRadius: 24, padding: 2, marginBottom: 12, background: `linear-gradient(90deg, ${homeFt.color}, ${awayFt.color})`, boxShadow: "0 12px 40px rgba(0,0,0,0.35)" }
    : { borderRadius: 24, marginBottom: 12, boxShadow: `0 0 0 2px ${missing ? "var(--loss)" : ft.color}, 0 12px 40px rgba(${ft.colorRgb},0.25)` };

  return (
    <div style={outer}>
      <div style={{ borderRadius: split ? 22 : 24, overflow: "hidden", background: ft.bgDark }}>
        <div style={{ position: "relative", height: 190, overflow: "hidden" }}>
          {split ? <SplitPhotos homeFt={homeFt} awayFt={awayFt} /> : (
            <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${ft.photo}')`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.45) saturate(1.3)" }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: split
            ? `linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(10,10,10,0.55) 60%, ${ft.bgDark} 100%)`
            : `linear-gradient(180deg, rgba(${ft.colorRgb},0.15) 0%, rgba(var(--bg-rgb),0.55) 55%, ${ft.bgDark} 100%)` }} />
          <div style={{ position: "absolute", top: 12, left: 14 }}><span style={chip}>{match.round}</span></div>
          <div style={{ position: "absolute", top: 12, right: 14 }}><span style={{ ...chip, fontWeight: 600 }}>{formatDate(match.match_date)} · {match.match_time?.slice(0, 5)}</span></div>
          {split && (
            <div style={{ position: "absolute", left: "50%", top: "44%", transform: "translate(-50%,-50%)", width: 38, height: 38, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "1.5px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: "#fff" }}>X</div>
          )}
          <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <FeaturedSide team={match.home} highlight={split || match.home === featured} ft={split ? homeFt : ft} compact={split} />
            {!split && <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, color: "rgba(var(--ink-rgb),0.4)", flexShrink: 0 }}>VS</span>}
            <FeaturedSide team={match.away} highlight={split || match.away === featured} ft={split ? awayFt : ft} nameFirst compact={split} />
          </div>
        </div>
        <div style={{ background: ft.bgDark, padding: 14 }}>
          <div className="odds">
            {["home", "draw", "away"].map(pick => {
              const isSel = tip?.pick === pick && !lck;
              return (
                <button key={pick} className={`odd ${lck && tip?.pick !== pick ? "no" : ""}`} onClick={() => onTip(match.id, pick)} disabled={lck}
                  style={isSel ? { background: `rgba(${ft.colorRgb},0.15)`, borderColor: ft.color } : {}}>
                  <div className="ol" style={isSel ? { color: ft.textColor } : {}}>{PICK_LABELS[pick]}</div>
                  <div className="ov" style={isSel ? { color: ft.textColor } : {}}>{parseFloat(match[`odds_${pick}`]).toFixed(2)}</div>
                  <OddsTrend match={match} pick={pick} />
                </button>
              );
            })}
          </div>
          {!lck && tip && (
            <div style={{ marginTop: 10, background: `rgba(${ft.colorRgb},0.1)`, border: `1px solid rgba(${ft.colorRgb},0.3)`, borderRadius: 10, padding: "8px 12px", fontSize: 13, color: ft.textColor, fontWeight: 600 }}>
              ✓ Typ: {PICK_LABELS[tip.pick]} · +{parseFloat(match[`odds_${tip.pick}`]).toFixed(2)} pkt
            </div>
          )}
          {bottom}
        </div>
      </div>
    </div>
  );
}

// ── IKONY DOLNEGO MENU ────────────────────────────────────────────────────────
const NAV_PATHS = {
  matches: <><circle cx="12" cy="12" r="9.5" /><path d="M12 7.2l3.3 2.4-1.25 3.9h-4.1L8.7 9.6z" /><path d="M12 7.2V2.8M15.3 9.6l4.1-1.4M14.05 13.5l2.6 3.6M9.95 13.5l-2.6 3.6M8.7 9.6L4.6 8.2" /></>,
  leaderboard: <><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" /><path d="M6 4H4.5a2.5 2.5 0 0 0 0 5H6M18 4h1.5a2.5 2.5 0 0 1 0 5H18M12 15v4M8 22h8M10 19h4" /></>,
  stats: <><rect x="4" y="12" width="4" height="8" rx="1" /><rect x="10" y="5" width="4" height="15" rx="1" /><rect x="16" y="9" width="4" height="11" rx="1" /></>,
  chat: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />,
  rules: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" /><path d="M14 2v5h5M8 13h8M8 17h8M8 9h2" /></>,
  more: <><circle cx="5" cy="12" r="1.2" /><circle cx="12" cy="12" r="1.2" /><circle cx="19" cy="12" r="1.2" /></>,
  admin: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></>,
};

export function NavIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {NAV_PATHS[name]}
    </svg>
  );
}

// ── ZNAK APLIKACJI: boisko z lotu ptaka ───────────────────────────────────────
export function PitchMark({ size = 36 }) {
  return (
    <svg className="pitch-mark" width={size} height={size * 0.66} viewBox="0 0 40 26" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="1" width="38" height="24" rx="2" />
      <line x1="20" y1="1" x2="20" y2="25" />
      <circle cx="20" cy="13" r="4.5" />
      <circle cx="20" cy="13" r="0.9" fill="currentColor" stroke="none" />
      <rect x="1" y="6.5" width="7" height="13" />
      <rect x="32" y="6.5" width="7" height="13" />
      <rect x="1" y="10" width="2.8" height="6" />
      <rect x="36.2" y="10" width="2.8" height="6" />
    </svg>
  );
}

// ── ZMIANA NICKU ──────────────────────────────────────────────────────────────
export function NickEditor({ profile, profiles, onSave }) {
  const [value, setValue] = useState(profile?.name || "");
  const [saving, setSaving] = useState(false);
  const clean = normalizeNick(value);
  const nextAt = profile?.name_changed_at ? new Date(new Date(profile.name_changed_at).getTime() + NICK_DAYS * 86400000) : null;
  const locked = !profile?.is_admin && nextAt && nextAt > new Date();
  const taken = profiles.some(p => p.id !== profile?.id && (p.name || "").toLowerCase() === clean.toLowerCase());
  const error = clean.length < NICK_MIN || clean.length > NICK_MAX ? `Nick musi mieć od ${NICK_MIN} do ${NICK_MAX} znaków`
    : taken ? "Ten nick jest już zajęty" : null;
  const same = clean === profile?.name;
  const when = d => d.toLocaleString("pl-PL", { timeZone: "Europe/Warsaw", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

  const save = async () => { setSaving(true); await onSave(clean); setSaving(false); };

  return (
    <>
      <div className="sh">Twój nick</div>
      <div className="nick-card">
        <input className="mi" value={value} maxLength={30} onChange={e => setValue(e.target.value)} disabled={locked}
          aria-label="Nowy nick" onKeyDown={e => { if (e.key === "Enter" && !locked && !same && !error) save(); }} />
        <div className={`nick-hint ${!locked && !same && error ? "err" : ""}`}>
          {locked ? `Kolejna zmiana możliwa od ${when(nextAt)}.`
            : !same && error ? error
            : `Od ${NICK_MIN} do ${NICK_MAX} znaków. Spacje w środku są dozwolone, np. „Stary Wilk”.`}
        </div>
        <button className="mprim" onClick={save} disabled={locked || same || !!error || saving}>
          {saving ? "Zapisywanie..." : "Zapisz nick"}
        </button>
        <div className="nick-note">
          Nick możesz zmienić raz na {NICK_DAYS} dni. Nowy nick od razu pojawi się w tabeli, na czacie, w statystykach i w strefie kuponów.
        </div>
      </div>
    </>
  );
}
