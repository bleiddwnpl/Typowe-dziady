import { useState, useEffect } from "react";
import { TEAM_LOGOS, TEAMS_BY_LEAGUE, FEATURED_TEAMS, PICK_LABELS, getAvatar, getTeamsForLeague, getFeaturedTeam, isMatchLocked } from "./lib";

// Wspólne elementy interfejsu używane przez kilka zakładek

// ── LOGO KLUBU I AVATAR ───────────────────────────────────────────────────────
export function TeamLogo({ name, size = 32 }) {
  const logo = TEAM_LOGOS[name];
  const av = getAvatar(name);
  if (logo) return (
    <img src={logo} alt={name} style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />
  );
  return <div style={{ width: size, height: size, borderRadius: "50%", background: av.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{av.initials}</div>;
}

export function ClubAvatar({ favoriteTeam, name, size = 32 }) {
  const av = getAvatar(name);
  const logo = favoriteTeam ? TEAM_LOGOS[favoriteTeam] : null;
  if (logo) return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "rgba(0,0,0,0.3)", border: "1.5px solid rgba(0,122,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
      <img src={logo} alt={favoriteTeam} style={{ width: size * 0.72, height: size * 0.72, objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} />
    </div>
  );
  return <div style={{ width: size, height: size, borderRadius: "50%", background: av.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{av.initials}</div>;
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

// ── TEAM PICKER ───────────────────────────────────────────────────────────────
export function TeamPicker({ onSave, onSkip }) {
  const [sel, setSel] = useState(null);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", backdropFilter: "blur(20px)" }}>
      <div style={{ background: "#080e1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "28px 28px 0 0", padding: "28px 20px 48px", width: "100%", maxWidth: 480, maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, margin: "0 auto 20px" }} />
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: "#fff", letterSpacing: 2, textAlign: "center", marginBottom: 4 }}>TWÓJ ULUBIONY KLUB</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 18 }}>Logo pojawi się przy Twoim nicku w rankingu i czacie</div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {Object.entries(TEAMS_BY_LEAGUE).map(([lgName, teams]) => (
            <div key={lgName}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase", padding: "10px 4px 6px" }}>{lgName}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 8 }}>
                {Object.entries(teams).map(([name, logo]) => (
                  <div key={name} onClick={() => setSel(name)}
                    style={{ background: sel === name ? "rgba(0,122,255,0.15)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${sel === name ? "#007aff" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: "10px 6px", textAlign: "center", cursor: "pointer", transition: "all 0.18s" }}>
                    <img src={logo} alt={name} style={{ width: 36, height: 36, objectFit: "contain", display: "block", margin: "0 auto 5px" }} onError={e => { e.target.style.opacity = "0.2"; }} />
                    <div style={{ fontSize: 8, color: sel === name ? "#60a5fa" : "rgba(255,255,255,0.5)", fontWeight: 600, lineHeight: 1.2 }}>{name}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => onSave(sel)} disabled={!sel} style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#0051cc,#007aff)", border: "none", borderRadius: 14, color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: sel ? "pointer" : "not-allowed", marginTop: 14, opacity: sel ? 1 : 0.35 }}>Zapisz wybór →</button>
        <button onClick={onSkip} style={{ width: "100%", padding: 10, background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", fontFamily: "inherit", fontSize: 13, cursor: "pointer", marginTop: 6 }}>Pomiń na razie</button>
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
        <div style={{ width: `${h}%`, background: "#34c759", borderRadius: "8px 0 0 8px", transition: "width 0.4s" }} />
        <div style={{ width: `${d}%`, background: "rgba(255,255,255,0.25)", transition: "width 0.4s" }} />
        <div style={{ width: `${a}%`, background: "#ff3b30", borderRadius: "0 8px 8px 0", transition: "width 0.4s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {[["#34c759","Gosp.",h],["rgba(255,255,255,0.5)","Remis",d],["#ff3b30","Gość",a]].map(([color,label,pct]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontWeight: 700 }}>{label}</span>
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
    <div style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: 20, marginBottom: 12, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", background: "rgba(167,139,250,0.06)", borderBottom: "1px solid rgba(167,139,250,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", padding: "3px 10px", borderRadius: 20 }}>🗳️ ANKIETA</span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>{totalVotes} głosów{closed ? " · Zamknięta" : ""}</span>
      </div>
      <div style={{ padding: "14px 14px 12px" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 12, lineHeight: 1.4 }}>{poll.question}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {options.filter(o => o.poll_id === poll.id).map(opt => {
            const optVotes = votes.filter(v => v.poll_id === poll.id && v.option_id === opt.id).length;
            const pct = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
            const isMyVote = myVote?.option_id === opt.id;
            const showBar = !!myVote || closed;
            return (
              <button key={opt.id} onClick={() => !myVote && !closed && onVote(poll.id, opt.id)} disabled={!!myVote || closed}
                style={{ width: "100%", padding: "10px 14px", background: isMyVote ? "rgba(167,139,250,0.12)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${isMyVote ? "#a78bfa" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, cursor: myVote || closed ? "default" : "pointer", position: "relative", overflow: "hidden", textAlign: "left", fontFamily: "inherit", transition: "all 0.2s" }}>
                {showBar && <div style={{ position: "absolute", inset: 0, background: isMyVote ? "rgba(167,139,250,0.08)" : "rgba(255,255,255,0.03)", width: `${pct}%`, transition: "width 0.5s ease" }} />}
                <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: isMyVote ? 700 : 500, color: isMyVote ? "#c4b5fd" : "#fff" }}>{isMyVote && "✓ "}{opt.label}</span>
                  {showBar && <span style={{ fontSize: 12, fontWeight: 700, color: isMyVote ? "#a78bfa" : "rgba(255,255,255,0.4)" }}>{pct}%</span>}
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: myVote ? "#a78bfa" : "rgba(255,255,255,0.3)", fontWeight: myVote ? 600 : 400, textAlign: "center" }}>
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
  const cols = [["home", "#34c759"], ["draw", "rgba(255,255,255,0.6)"], ["away", "#ff3b30"]];

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
  const when = match.match_date === today ? `o ${time}` : `${match.match_date} o ${time}`;
  return <div className="picks-hidden">🔒 Typy graczy odsłonią się {when}</div>;
}

// ── KARTA NADCHODZĄCEGO MECZU ─────────────────────────────────────────────────
// Sama wybiera wygląd: zwykła karta albo duża karta wyróżnionego klubu
export function MatchCard({ match, tip, stats, tips, profiles, userId, onTip, onLocked }) {
  const lck = isMatchLocked(match);
  const featured = getFeaturedTeam(match);

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
        <span className="mtime">{match.match_date} · {match.match_time?.slice(0, 5)}</span>
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
function FeaturedSide({ team, featured, ft, nameFirst }) {
  const isF = team === featured;
  const size = isF ? 44 : 40;
  const logo = (
    <img src={TEAM_LOGOS[team]} alt={team}
      style={{ width: size, height: size, objectFit: "contain", flexShrink: 0, filter: isF ? `drop-shadow(0 2px 10px rgba(${ft.colorRgb},0.6))` : "drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }} />
  );
  const name = (
    <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: isF ? 24 : 20, color: isF ? ft.textColor : "#fff", letterSpacing: 0.5, textShadow: isF ? `0 0 20px rgba(${ft.colorRgb},0.5)` : "none", textAlign: nameFirst ? "right" : "left" }}>
      {team.toUpperCase()}
    </span>
  );
  return <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{nameFirst ? <>{name}{logo}</> : <>{logo}{name}</>}</div>;
}

function FeaturedMatchCard({ match, tip, onTip, lck, featured, missing, bottom }) {
  const ft = FEATURED_TEAMS[featured];
  const chip = { background: "rgba(0,0,0,0.5)", color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, backdropFilter: "blur(6px)" };
  return (
    <div style={{ borderRadius: 24, overflow: "hidden", marginBottom: 12, boxShadow: `0 0 0 2px ${missing ? "#ff3b30" : ft.color}, 0 12px 40px rgba(${ft.colorRgb},0.25)` }}>
      <div style={{ position: "relative", height: 190 }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${ft.photo}')`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.45) saturate(1.3)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(${ft.colorRgb},0.15) 0%, rgba(6,10,15,0.55) 55%, ${ft.bgDark} 100%)` }} />
        <div style={{ position: "absolute", top: 12, left: 14 }}><span style={chip}>{match.round}</span></div>
        <div style={{ position: "absolute", top: 12, right: 14 }}><span style={{ ...chip, fontWeight: 600 }}>{match.match_date} · {match.match_time?.slice(0, 5)}</span></div>
        <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <FeaturedSide team={match.home} featured={featured} ft={ft} />
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>VS</span>
          <FeaturedSide team={match.away} featured={featured} ft={ft} nameFirst />
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
  );
}
