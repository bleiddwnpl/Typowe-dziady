
import { useState, useEffect, useMemo } from "react";
import { supabase, LEAGUE_LOGOS, buildLeaderboard, buildRoundStars, buildRankChanges, isMatchLocked } from "./lib";
import { css } from "./styles";
import { ClubAvatar, TeamPicker } from "./components";
import { useAppData } from "./useAppData";
import AuthScreen from "./AuthScreen";
import ErrorBoundary from "./ErrorBoundary";
import MatchesTab from "./tabs/MatchesTab";
import LeaderboardTab from "./tabs/LeaderboardTab";
import ChatTab from "./tabs/ChatTab";
import RulesTab from "./tabs/RulesTab";
import StatsTab from "./tabs/StatsTab";
import AdminTab from "./tabs/AdminTab";

function Splash({ label }) {
  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: "#060a0f", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
        <div style={{ width: 52, height: 52, background: "linear-gradient(135deg,#0051cc,#007aff)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>⚽</div>
        {label && <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, color: "rgba(96,165,250,0.6)", letterSpacing: 3 }}>{label}</div>}
      </div>
    </>
  );
}

// ── GŁÓWNA APLIKACJA ──────────────────────────────────────────────────────────
function MainApp({ user, profile: initialProfile, onLogout }) {
  const [profile, setProfile] = useState(initialProfile);
  const [tab, setTab] = useState("matches");
  const [activeLeague, setActiveLeague] = useState(null);
  const [showTeamPicker, setShowTeamPicker] = useState(false);

  const data = useAppData(user, profile);
  const { leagues, matches, tips, tipStats, profiles, polls, pollOptions, pollVotes, loading, toast, onlineUsers, actions } = data;

  // Domyślnie pierwsza liga
  useEffect(() => {
    if (!activeLeague && leagues.length > 0) setActiveLeague(leagues[0].id);
  }, [leagues, activeLeague]);

  // Nowy gracz bez klubu → wybór klubu
  useEffect(() => {
    if (initialProfile?.favorite_team) return;
    const t = setTimeout(() => setShowTeamPicker(true), 800);
    return () => clearTimeout(t);
  }, []);

  const { upcoming, finished, leagueMatchIds } = useMemo(() => {
    const lm = matches.filter(m => m.league_id === activeLeague);
    return {
      upcoming: lm.filter(m => m.status === "upcoming"),
      finished: lm.filter(m => m.status === "finished"),
      leagueMatchIds: lm.map(m => m.id),
    };
  }, [matches, activeLeague]);

  const leaguePolls = useMemo(() => polls.filter(p => p.league_id === activeLeague), [polls, activeLeague]);
  const lb = useMemo(() => buildLeaderboard(profiles, tips, matches, leagueMatchIds), [profiles, tips, matches, leagueMatchIds]);
  const roundStars = useMemo(() => buildRoundStars(profiles, tips, finished), [profiles, tips, finished]);
  const rankChanges = useMemo(() => buildRankChanges(profiles, tips, [...upcoming, ...finished]), [profiles, tips, upcoming, finished]);

  // Ile nadchodzących meczów bez mojego typu w każdej lidze (odświeża się co minutę razem z rozkładem typów)
  const missingByLeague = useMemo(() => {
    const mine = new Set(tips.filter(t => t.user_id === user.id).map(t => t.match_id));
    const out = {};
    matches.forEach(m => {
      if (m.status === "upcoming" && !isMatchLocked(m) && !mine.has(m.id)) out[m.league_id] = (out[m.league_id] || 0) + 1;
    });
    return out;
  }, [matches, tips, tipStats, user.id]); // eslint-disable-line

  const me = lb.find(u => u.id === user.id);
  const myRank = lb.findIndex(u => u.id === user.id) + 1;
  const activeLg = leagues.find(l => l.id === activeLeague);
  const myTip = id => tips.find(t => t.user_id === user.id && t.match_id === id);

  const isAdmin = profile?.is_admin || (profile?.admin_leagues && activeLeague && profile.admin_leagues.includes(activeLeague));

  const saveTeam = async team => {
    if (!team) return;
    if (await actions.saveFavoriteTeam(team)) {
      setProfile(prev => ({ ...prev, favorite_team: team }));
      setShowTeamPicker(false);
    }
  };

  const tabs = [
    { key: "matches", icon: "⚽", label: "Mecze" },
    { key: "leaderboard", icon: "🏆", label: "Tabela" },
    { key: "stats", icon: "📊", label: "Statystyki" },
    { key: "chat", icon: "💬", label: "Czat" },
    { key: "rules", icon: "📋", label: "Regulamin" },
    ...(isAdmin ? [{ key: "admin", icon: "⚙️", label: "Admin" }] : []),
  ];

  if (loading) return <Splash label="ŁADOWANIE" />;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {showTeamPicker && <TeamPicker onSave={saveTeam} onSkip={() => setShowTeamPicker(false)} />}

        {/* NAGŁÓWEK */}
        <div className="hdr">
          <div className="hdr-photo" /><div className="hdr-ov" />
          <div className="hdr-ct">
            <div className="hdr-top">
              <div className="logo">TYPOWE <span>DZIADY</span></div>
              <div className="hdr-r">
                <div className="upill" onClick={() => setShowTeamPicker(true)} title={onlineUsers.map(u => u.name).join(", ")}>
                  <ClubAvatar favoriteTeam={profile?.favorite_team} name={profile?.name || ""} size={26} />
                  <div style={{ minWidth: 0 }}>
                    <div className="uname">{profile?.name || "Ty"}</div>
                    {onlineUsers.length > 0 && <div className="uonline"><span className="uonline-dot" />{onlineUsers.length} online</div>}
                  </div>
                </div>
                <button className="uout" onClick={onLogout}>Wyloguj</button>
              </div>
            </div>

            <div className="league-tabs">
              {leagues.map(l => (
                <button key={l.id} className={`league-tab ${activeLeague === l.id ? "active" : ""}`} onClick={() => setActiveLeague(l.id)} title={l.name}>
                  <img src={LEAGUE_LOGOS[l.name]} alt={l.name} onError={e => { e.target.style.opacity = "0.2"; }} />
                  {missingByLeague[l.id] > 0 && <div className="lbadge">{missingByLeague[l.id]}</div>}
                  <div className="ldot" />
                </button>
              ))}
            </div>

            <div className="stats">
              {[
                { label: "Punkty", value: (me?.points || 0).toFixed(2), b: true },
                { label: "Pozycja", value: `#${myRank}` },
                { label: "Trafione", value: me?.correct || 0 },
              ].map(s => (
                <div key={s.label} className="sbox">
                  <div className="slbl">{s.label}</div>
                  <div className={`sval ${s.b ? "b" : ""}`}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ZAKŁADKI — błąd w jednej zakładce nie wyłącza reszty aplikacji */}
        <div className="ct">
          <ErrorBoundary inline key={`${tab}-${activeLeague}`}>
          {tab === "matches" && (
            <MatchesTab activeLg={activeLg} leaguePolls={leaguePolls} pollOptions={pollOptions} pollVotes={pollVotes}
              userId={user.id} onVote={actions.castVote} upcoming={upcoming} finished={finished}
              tips={tips} tipStats={tipStats} profiles={profiles} myTip={myTip} onTip={actions.placeTip}
              onLocked={actions.refreshMatchTips} missingCount={missingByLeague[activeLeague] || 0} />
          )}
          {tab === "leaderboard" && <LeaderboardTab lb={lb} roundStars={roundStars} rankChanges={rankChanges} userId={user.id} activeLg={activeLg} finished={finished} tips={tips} />}
          {tab === "stats" && <StatsTab profiles={profiles} tips={tips} matches={matches} leagues={leagues} userId={user.id} />}
          {tab === "chat" && <ChatTab user={user} profile={profile} profiles={profiles} />}
          {tab === "rules" && <RulesTab profiles={profiles} tips={tips} matches={matches} leagues={leagues} userId={user.id} />}
          {tab === "admin" && isAdmin && (
            <AdminTab activeLeague={activeLeague} activeLg={activeLg} leagues={leagues} upcoming={upcoming} finished={finished}
              leaguePolls={leaguePolls} pollVotes={pollVotes} profiles={profiles} tipStats={tipStats} actions={actions} />
          )}
          </ErrorBoundary>
        </div>

        {/* NAWIGACJA */}
        <div className="nav">
          {tabs.map(t => (
            <button key={t.key} className={`ni ${tab === t.key ? "on" : ""}`} onClick={() => setTab(t.key)}>
              <div className="nic">{t.icon}</div>
              <div className="nlbl">{t.label}</div>
              <div className="ndot" />
            </button>
          ))}
        </div>

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}

// ── LOGOWANIE / SESJA ─────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [checking, setChecking] = useState(true);

  const loadProfile = async u => {
    const { data } = await supabase.from("profiles").select("*").eq("id", u.id).single();
    setProfile(data); setUser(u); setChecking(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadProfile(session.user);
      else setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) loadProfile(session.user);
      if (event === "SIGNED_OUT") { setUser(null); setProfile(null); setChecking(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  if (checking) return <Splash />;

  return (
    <ErrorBoundary>
      {user
        ? <MainApp user={user} profile={profile} onLogout={() => supabase.auth.signOut()} />
        : <AuthScreen onAuth={u => loadProfile(u)} />}
    </ErrorBoundary>
  );
}
