import { useState } from "react";
import { PICK_LABELS } from "../lib";
import { TeamLogo, PollCard, MatchCard } from "../components";

// ── FINISHED MATCHES ──────────────────────────────────────────────────────────
function FinishedMatches({ matches, myTip }) {
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── ZAKŁADKA MECZE ────────────────────────────────────────────────────────────
export default function MatchesTab({ activeLg, leaguePolls, pollOptions, pollVotes, userId, onVote, upcoming, finished, tips, myTip, onTip }) {
  return (
    <>
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
        <div className="sh">Nadchodzące</div>
        {upcoming.map(match => (
          <MatchCard key={match.id} match={match} tip={myTip(match.id)} tips={tips} onTip={onTip} />
        ))}
      </>}

      {finished.length > 0 && <FinishedMatches matches={finished} myTip={myTip} />}
    </>
  );
}
