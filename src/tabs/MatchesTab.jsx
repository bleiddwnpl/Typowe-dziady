import { useState, useMemo } from "react";
import { PICK_LABELS, buildRoundSummary } from "../lib";
import { TeamLogo, ClubAvatar, PollCard, MatchCard, PickReveal } from "../components";

// ── FINISHED MATCHES ──────────────────────────────────────────────────────────
function FinishedMatches({ matches, myTip, tips, profiles, userId }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 8 }}>
      <button onClick={() => setOpen(p => !p)}
        style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, color: "rgba(255,255,255,0.45)", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s" }}>
        <span>📁 Zakończone mecze ({matches.length})</span>
        <span style={{ fontSize: 11, opacity: 0.6 }}>{open ? "▲ Ukryj" : "▼ Pokaż"}</span>
      </button>
      {open && (
        <div style={{ marginTop: 8 }}>
          {matches.map(match => {
            const tip = myTip(match.id);
            const isCor = tip?.pick === match.result;
            return (
              <div key={match.id} className="mc" style={{ opacity: 0.85 }}>
                <div className="mt2">
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{match.round}</span>
                  <span className={isCor && tip ? "res-w" : tip ? "res-l" : "res-n"}>
                    {tip ? (isCor ? `+${parseFloat(match[`odds_${tip.pick}`]).toFixed(2)} pkt ✓` : "0 pkt ✗") : "Brak typu"}
                  </span>
                </div>
                <div className="mb2">
                  <div className="tms">
                    <div className="tm"><TeamLogo name={match.home} size={28} /><span className="tn">{match.home}</span></div>
                    <div className="vs-sep">
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, textAlign: "center" }}>Wynik</div>
                      <div className="vs-result">{PICK_LABELS[match.result]}</div>
                    </div>
                    <div className="tm r"><TeamLogo name={match.away} size={28} /><span className="tn">{match.away}</span></div>
                  </div>
                  <div className="odds">
                    {["home","draw","away"].map(pick => (
                      <button key={pick} className={`odd ${pick === match.result ? "ok" : tip?.pick === pick ? "no" : ""}`} disabled>
                        <div className="ol">{PICK_LABELS[pick]}</div>
                        <div className="ov" style={{ color: pick === match.result ? "#34c759" : "rgba(255,255,255,0.3)" }}>{parseFloat(match[`odds_${pick}`]).toFixed(2)}</div>
                      </button>
                    ))}
                  </div>
                  <PickReveal match={match} tips={tips} profiles={profiles} userId={userId} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── PODSUMOWANIE KOLEJKI ──────────────────────────────────────────────────────
const plural = (n, one, few, many) => {
  if (n === 1) return one;
  const d = n % 10, dd = n % 100;
  return d >= 2 && d <= 4 && (dd < 12 || dd > 14) ? few : many;
};

function RoundSummary({ summary, leagueId, userId }) {
  const storageKey = `rs-hidden-${leagueId}-${summary.round}`;
  const [hidden, setHidden] = useState(() => {
    try { return localStorage.getItem(storageKey) === "1"; } catch { return false; }
  });
  if (hidden) return null;

  const hide = () => {
    try { localStorage.setItem(storageKey, "1"); } catch { /* brak dostępu do pamięci przeglądarki */ }
    setHidden(true);
  };
  const { matchCount, playerCount } = summary;

  return (
    <div className="rs">
      <div className="rs-top">
        <div>
          <div className="rs-title">{summary.round} zakończona</div>
          <div className="rs-sub">
            {matchCount} {plural(matchCount, "mecz", "mecze", "meczów")} · {playerCount} {plural(playerCount, "gracz", "graczy", "graczy")}
          </div>
        </div>
        <button className="rs-x" onClick={hide} aria-label="Schowaj podsumowanie">✕</button>
      </div>

      <div className="rs-sec">Walka o gwiazdkę</div>
      {summary.top.map(x => (
        <div key={x.profile.id} className="rs-row">
          <div className="rs-pos">{x.pos === 1 ? "⭐" : x.pos}</div>
          <ClubAvatar favoriteTeam={x.profile.favorite_team} name={x.profile.name} size={30} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="rs-name">{x.profile.name}{x.profile.id === userId && <span className="lbme" style={{ marginLeft: 6 }}>TY</span>}</div>
            <div className="rs-det">{x.correct} z {matchCount} trafionych</div>
          </div>
          <div className="rs-val" style={{ color: x.pos === 1 ? "#fbbf24" : "#fff" }}>{x.pts.toFixed(2)}</div>
        </div>
      ))}

      {summary.best && (
        <div className="rs-hl">
          <div className="rs-ic" style={{ background: "rgba(52,199,89,0.15)" }}>🎯</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="rs-det" style={{ marginTop: 0, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, fontSize: 10 }}>Najwyższy trafiony kurs</div>
            <div className="rs-name">{summary.best.names.join(", ")}</div>
            <div className="rs-det">{summary.best.detail}</div>
          </div>
          <div className="rs-val" style={{ color: "#34c759" }}>{summary.best.odds.toFixed(2)}</div>
        </div>
      )}

      {summary.flop && (
        <div className="rs-hl">
          <div className="rs-ic" style={{ background: "rgba(255,59,48,0.15)" }}>🙈</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="rs-det" style={{ marginTop: 0, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, fontSize: 10 }}>Wpadka kolejki</div>
            <div className="rs-name">{summary.flop.profile.name}</div>
            <div className="rs-det">{summary.flop.correct} z {matchCount} trafionych</div>
          </div>
          <div className="rs-val" style={{ color: "#ff6b60" }}>{summary.flop.pts.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}

// ── ZAKŁADKA MECZE ────────────────────────────────────────────────────────────
export default function MatchesTab({ activeLg, leaguePolls, pollOptions, pollVotes, userId, onVote, upcoming, finished, tips, tipStats, profiles, myTip, onTip, onLocked, missingCount }) {
  const summary = useMemo(
    () => buildRoundSummary([...upcoming, ...finished], tips, profiles),
    [upcoming, finished, tips, profiles]
  );

  return (
    <>
      {summary && activeLg && (
        <RoundSummary key={`${activeLg.id}-${summary.round}`} summary={summary} leagueId={activeLg.id} userId={userId} />
      )}

      {leaguePolls.length > 0 && <>
        <div className="sh">Ankiety</div>
        {leaguePolls.map(poll => (
          <PollCard key={poll.id} poll={poll} options={pollOptions} votes={pollVotes} userId={userId} onVote={onVote} />
        ))}
      </>}

      {upcoming.length === 0 && finished.length === 0 && leaguePolls.length === 0 && (
        <div className="empty">
          <div className="ei">📅</div>
          <div className="et">Brak meczów</div>
          <div className="es">{activeLg ? `Admin doda mecze ${activeLg.name}` : "Wybierz ligę"}</div>
        </div>
      )}

      {upcoming.length > 0 && <>
        <div className="sh" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Nadchodzące</span>
          {missingCount > 0 && <span style={{ color: "#ff3b30", letterSpacing: 0, textTransform: "none", fontSize: 12 }}>{missingCount} bez typu</span>}
        </div>
        {upcoming.map(match => (
          <MatchCard key={match.id} match={match} tip={myTip(match.id)} stats={tipStats[match.id]} tips={tips}
            profiles={profiles} userId={userId} onTip={onTip} onLocked={onLocked} />
        ))}
      </>}

      {finished.length > 0 && <FinishedMatches matches={finished} myTip={myTip} tips={tips} profiles={profiles} userId={userId} />}
    </>
  );
}
