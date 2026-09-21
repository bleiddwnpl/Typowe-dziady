
import { createClient } from "@supabase/supabase-js";

// ── SUPABASE ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://lutrkrahqwumjlsatzzd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1dHJrcmFocXd1bWpsc2F0enpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1OTM5NTIsImV4cCI6MjEwMDE2OTk1Mn0.qx7b31OQXzBxiOen1I9y9szePuO8fVonQxtEJPJ51Rg";
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── ZASOBY ────────────────────────────────────────────────────────────────────
export const STADIUM_URL = "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&auto=format&fit=crop";
const CDN = "https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos";
const WF  = "https://cdn.prod.website-files.com/68f550992570ca0322737dc2";
const STORAGE = "https://lutrkrahqwumjlsatzzd.supabase.co/storage/v1/object/public/Legia";

export const PICK_LABELS = { home: "1", draw: "X", away: "2" };
export const PICK_NAMES  = { home: "Gospodarz", draw: "Remis", away: "Gość" };

// ── LOGA LIG ──────────────────────────────────────────────────────────────────
export const LEAGUE_LOGOS = {
  "Ekstraklasa":    `${WF}/6a5df45705e50bc41db6072b_ekstraklasa-poland-logo-footylogos.webp`,
  "Premier League": `https://assets.footylogos.com/logos/premier-league-england-white-logo-footylogos.svg`,
  "La Liga":        `${CDN}/laliga-spain/laliga-spain-logo-footylogos.png`,
  "Serie A":        `${WF}/6a468a21f1682fa05497a4ed_serie-a-italy-logo-footylogos.webp`,
  "Liga Mistrzów":  `https://assets.footylogos.com/logos/uefa-champions-league-symbol-white/uefa-champions-league-symbol-white-logo-footylogos.svg`,
};

// ── LOGA KLUBÓW ───────────────────────────────────────────────────────────────
export const TEAMS_BY_LEAGUE = {
  "Ekstraklasa": {
    "Bruk-Bet Termalica Nieciecza": `${WF}/6a5df3f862117e57608389dd_bruk-bet-termalica-nieciecza-logo-footylogos.webp`,
    "Cracovia":          `${WF}/6a5df535f6d53ebf9e38f7c3_ks-cracovia-logo-footylogos.webp`,
    "GKS Katowice":      `${WF}/6a5df4ca8b206768fa155676_gks-katowice-logo-footylogos.webp`,
    "Górnik Zabrze":     `${WF}/6a5df4da05e50bc41db66cfd_gornik-zabrze-logo-footylogos.webp`,
    "Jagiellonia Białystok": `${WF}/6a5df523c149ca67381ffbe3_jagiellonia-bialystok-logo-footylogos.webp`,
    "Korona Kielce":     `${WF}/6a5df5498ba294066bcca15b_korona-kielce-logo-footylogos.webp`,
    "Lech Poznań":       `${WF}/6a5df557ae7b0d3c31b057d9_lech-poznan-logo-footylogos.webp`,
    "Lechia Gdańsk":     `${WF}/6a5df55819824fd8ee02f046_lechia-gdansk-logo-footylogos.webp`,
    "Legia Warszawa":    `${WF}/6a5df559e2fc5acdc52a9ebb_legia-warszawa-logo-footylogos.webp`,
    "Motor Lublin":      `${WF}/6a5df58a63ed6fd0dfdcd473_motor-lublin-logo-footylogos.webp`,
    "Piast Gliwice":     `${WF}/6a5df5e71dbe3179dcfad266_piast-gliwice-logo-footylogos.webp`,
    "Pogoń Szczecin":    `${WF}/6a5df5e95210fea67e706aa2_pogon-szczecin-logo-footylogos.webp`,
    "Radomiak Radom":    `${WF}/6a5df6044d55dca3a4dba667_radomiak-radom-logo-footylogos.webp`,
    "Raków Częstochowa": `${WF}/6a5df606fc56c8c9302093d7_rakow-czestochowa-logo-footylogos.webp`,
    "Stal Mielec":       `${WF}/6a5df676952b0dd6df753502_stal-mielec-logo-footylogos.webp`,
    "Widzew Łódź":       `${WF}/6a5df6c6c0a6a42dbf5a54d3_widzew-lodz-logo-footylogos.webp`,
    "Wieczysta Kraków":  `https://media.cms.ekstraklasa.org/images/originals/019f0a5d-acca-760e-85ca-6d11d8f504db.png`,
    "Wisła Kraków":      `${WF}/6a3012facb55a01041811557_wisla-krakow-footylogos.webp`,
    "Wisła Płock":       `${WF}/6a5df6c7a5db3796b344a99a_wisla-plock-logo-footylogos.webp`,
    "Zagłębie Lubin":    `${WF}/6a5df6cf891ff56ef567dc76_zaglebie-lubin-logo-footylogos.webp`,
    "Śląsk Wrocław":     `${WF}/6a5df65cf6d53ebf9e39b1c1_slask-wroclaw-logo-footylogos.png`,
    "ŁKS Łódź":         `${WF}/6a5df5501dbe3179dcfa80ed_lks-lodz-logo-footylogos.webp`,
  },
  "Premier League": {
    "AFC Bournemouth":        `${CDN}/afc-bournemouth/afc-bournemouth-logo-footylogos.png`,
    "Arsenal":                `${CDN}/arsenal/arsenal-logo-footylogos.png`,
    "Aston Villa":            `${CDN}/aston-villa/aston-villa-logo-footylogos.png`,
    "Brentford":              `${CDN}/brentford/brentford-logo-footylogos.png`,
    "Brighton & Hove Albion": `${CDN}/brighton-and-hove-albion/brighton-and-hove-albion-logo-footylogos.png`,
    "Chelsea":                `${CDN}/chelsea/chelsea-logo-footylogos.png`,
    "Coventry City":          `${CDN}/coventry-city/coventry-city-logo-footylogos.png`,
    "Crystal Palace":         `${CDN}/crystal-palace/crystal-palace-logo-footylogos.png`,
    "Everton":                `${CDN}/everton/everton-logo-footylogos.png`,
    "Fulham":                 `${CDN}/fulham/fulham-logo-footylogos.png`,
    "Hull City":              `${CDN}/hull-city/hull-city-logo-footylogos.png`,
    "Ipswich Town":           `${CDN}/ipswich-town/ipswich-town-logo-footylogos.png`,
    "Leeds United":           `${CDN}/leeds-united/leeds-united-logo-footylogos.png`,
    "Liverpool":              `${CDN}/liverpool-fc/liverpool-fc-logo-footylogos.png`,
    "Manchester City":        `${CDN}/manchester-city/manchester-city-logo-footylogos.png`,
    "Manchester United":      `${CDN}/manchester-united/manchester-united-logo-footylogos.png`,
    "Newcastle United":       `${CDN}/newcastle-united/newcastle-united-logo-footylogos.png`,
    "Nottingham Forest":      `${CDN}/nottingham-forest/nottingham-forest-logo-footylogos.png`,
    "Sunderland":             `${CDN}/sunderland/sunderland-logo-footylogos.png`,
    "Tottenham Hotspur":      `${CDN}/tottenham-hotspur/tottenham-hotspur-logo-footylogos.png`,
  },
  "La Liga": {
    "Atlético Madrid":   `${CDN}/atletico-madrid/atletico-madrid-logo-footylogos.png`,
    "Athletic Bilbao":   `${CDN}/athletic-club-bilbao/athletic-club-bilbao-logo-footylogos.png`,
    "Barcelona":         `${CDN}/fc-barcelona/fc-barcelona-logo-footylogos.png`,
    "Celta Vigo":        `${CDN}/celta-vigo/celta-vigo-logo-footylogos.png`,
    "Deportivo Alavés":  `${CDN}/deportivo-alaves/deportivo-alaves-logo-footylogos.png`,
    "Deportivo La Coruña": `${CDN}/deportivo-la-coruna/deportivo-la-coruna-logo-footylogos.png`,
    "Elche":             `${CDN}/elche-cf/elche-cf-logo-footylogos.png`,
    "Espanyol":          `${CDN}/rcd-espanyol-barcelona/rcd-espanyol-barcelona-logo-footylogos.png`,
    "Getafe":            `${CDN}/getafe-cf/getafe-cf-logo-footylogos.png`,
    "Girona":            `${CDN}/girona-fc/girona-fc-logo-footylogos.png`,
    "Levante":           `${CDN}/levante-ud/levante-ud-logo-footylogos.png`,
    "Málaga":            `${CDN}/malaga-cf/malaga-cf-logo-footylogos.png`,
    "Mallorca":          `${CDN}/rcd-mallorca/rcd-mallorca-logo-footylogos.png`,
    "Osasuna":           `${CDN}/osasuna/osasuna-logo-footylogos.png`,
    "Racing Santander":  `${WF}/6a5dfeef3bcf8f77ef7a61e7_racing-santander-logo-footylogos.webp`,
    "Rayo Vallecano":    `${CDN}/rayo-vallecano/rayo-vallecano-logo-footylogos.png`,
    "Real Betis":        `${CDN}/real-betis-balompie/real-betis-balompie-logo-footylogos.png`,
    "Real Madrid":       `${CDN}/real-madrid/real-madrid-logo-footylogos.png`,
    "Real Sociedad":     `${CDN}/real-sociedad/real-sociedad-logo-footylogos.png`,
    "Sevilla":           `${CDN}/sevilla-fc/sevilla-fc-logo-footylogos.png`,
    "Valencia":          `${CDN}/valencia-cf/valencia-cf-logo-footylogos.png`,
    "Villarreal":        `${CDN}/villarreal-cf/villarreal-cf-logo-footylogos.png`,
    "Valladolid":        `${CDN}/real-valladolid/real-valladolid-logo-footylogos.png`,
  },
  "Serie A": {
    "AC Milan":    `${WF}/6a2dabc3c4421c75c1c638d4_68f59173c54aab3bb289682d_ac-milan-footballlogos-org.webp`,
    "Atalanta":    `${WF}/6a18dc636c0dc2b32f114cb9_atalanta-footylogos.png`,
    "Bologna":     `${WF}/68f590332f7e2e5f2f5c3c77_bologna-footballlogos-org.webp`,
    "Cagliari":    `${WF}/68f58fb0f8b72e10fcca8279_cagliari-footballlogos-org.webp`,
    "Como":        `${CDN}/como-1907/como-1907-logo-footylogos.png`,
    "Empoli":      `${CDN}/empoli-fc/empoli-fc-logo-footylogos.png`,
    "Fiorentina":  `${WF}/6a2dabf259cd193f6f9a9ee8_68f58f8cf8b72e10fcca7f4e_fiorentina-footballlogos-org.webp`,
    "Frosinone":   `${CDN}/frosinone-calcio/frosinone-calcio-logo-footylogos.png`,
    "Genoa":       `${WF}/68f590871f0d9bd8bb64af24_genoa-footballlogos-org.webp`,
    "Inter Milan": `${WF}/6a2dabf8be544df394f36f0b_68f590dc82d343819638a796_inter-milan-footballlogos-org.webp`,
    "Juventus":    `${WF}/6a2dabfe3f65f5442c3327cf_68f591085f8ea61de0a1cc6a_juventus-footballlogos-org.webp`,
    "Lazio":       `${WF}/68f591295ba37a0850ada7ff_lazio-footballlogos-org.webp`,
    "Lecce":       `${WF}/68f591503b74d5a9a7f6435c_lecce-footballlogos-org.webp`,
    "Monza":       `${CDN}/ac-monza/ac-monza-logo-footylogos.png`,
    "Napoli":      `${WF}/6a2dac0f635d5e15f396735b_69fb26f9f2009903393e5eff_napoli-footylogos.webp`,
    "Parma":       `${WF}/68f591c871c3891858936f5c_parma-footballlogos-org.webp`,
    "AS Roma":     `${WF}/69f685fdf9803881d891451c_roma-footylogos.webp`,
    "Sassuolo":    `${WF}/68f5923bdfbd72754cd17a3c_sassuolo-footballlogos-org.webp`,
    "Torino":      `${WF}/68f5926167bb453c3fe7cec0_torino-footballlogos-org.webp`,
    "Udinese":     `${WF}/68f5928a0decdd9736d3a737_udinese-footballlogos-org.webp`,
    "Venezia":     `${CDN}/venezia-fc/venezia-fc-logo-footylogos.png`,
  },
};

export const TEAM_LOGOS = Object.values(TEAMS_BY_LEAGUE).reduce((acc, t) => ({ ...acc, ...t }), {});

// Liga Mistrzów = drużyny z Premier League, La Liga i Serie A
export const getTeamsForLeague = (lgName) => {
  if (lgName === "Liga Mistrzów") {
    return [
      ...Object.keys(TEAMS_BY_LEAGUE["Premier League"]),
      ...Object.keys(TEAMS_BY_LEAGUE["La Liga"]),
      ...Object.keys(TEAMS_BY_LEAGUE["Serie A"]),
    ].sort();
  }
  return TEAMS_BY_LEAGUE[lgName] ? Object.keys(TEAMS_BY_LEAGUE[lgName]).sort() : Object.keys(TEAM_LOGOS).sort();
};

// ── WYRÓŻNIONE KLUBY (duża karta ze zdjęciem) ─────────────────────────────────
// Nowy klub = nowy wpis. Nazwa musi być identyczna jak w TEAMS_BY_LEAGUE.
export const FEATURED_TEAMS = {
  "Legia Warszawa": { photo: `${STORAGE}/L1.jpg`, color: "#00963f", colorRgb: "0,150,63",   textColor: "#4ade80", bgDark: "#0a1a10" },
  "Barcelona":      { photo: `${STORAGE}/B.jpg`,  color: "#a50044", colorRgb: "165,0,68",   textColor: "#fb7185", bgDark: "#1a0a10" },
  "Real Madrid":    { photo: `${STORAGE}/R.jpg`,  color: "#febe10", colorRgb: "254,190,16", textColor: "#fde047", bgDark: "#1a1608" },
};

export const getFeaturedTeam = (match) =>
  FEATURED_TEAMS[match.home] ? match.home : FEATURED_TEAMS[match.away] ? match.away : null;

// ── AVATARY ───────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "linear-gradient(135deg,#c8102e,#8b0000)",
  "linear-gradient(135deg,#ff9500,#ff6b00)",
  "linear-gradient(135deg,#007aff,#0051cc)",
  "linear-gradient(135deg,#af52de,#7a3ec2)",
  "linear-gradient(135deg,#34c759,#1a7a38)",
  "linear-gradient(135deg,#5ac8fa,#007aff)",
  "linear-gradient(135deg,#ffcc00,#ff9500)",
];

export const getAvatar = (name = "") => ({
  initials: name.slice(0, 1).toUpperCase() || "?",
  gradient: AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length],
});

// ── BLOKADA TYPOWANIA (czas Warszawy) ─────────────────────────────────────────
export const isMatchLocked = (m) => {
  const now = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Warsaw",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).format(new Date()).replace(" ", "T");
  return now >= `${m.match_date}T${m.match_time?.slice(0, 5)}`;
};

// ── RANKING ───────────────────────────────────────────────────────────────────
// Punkty, trafienia i bilans (stała stawka 100 zł) dla wskazanych meczów
export function buildLeaderboard(profiles, tips, matches, matchIds) {
  const ids = new Set(matchIds);
  const byId = new Map(matches.map(m => [m.id, m]));
  return profiles.map(p => {
    const userTips = tips.filter(t => t.user_id === p.id && ids.has(t.match_id));
    const points = userTips.reduce((s, t) => s + (t.points || 0), 0);
    const correct = userTips.filter(t => t.points > 0).length;
    const balance = userTips.reduce((s, t) => {
      const m = byId.get(t.match_id);
      if (!m || m.status !== "finished") return s;
      return t.points > 0 ? s + parseFloat(m[`odds_${m.result}`]) * 100 - 100 : s - 100;
    }, 0);
    return { ...p, points, correct, balance };
  }).sort((a, b) => b.points - a.points);
}

// Gwiazdki: najlepszy wynik w każdej zakończonej kolejce (remis = gwiazdka dla wszystkich)
export function buildRoundStars(profiles, tips, finishedMatches) {
  const stars = {};
  const rounds = [...new Set(finishedMatches.map(m => m.round))];
  rounds.forEach(round => {
    const ids = new Set(finishedMatches.filter(m => m.round === round).map(m => m.id));
    const scores = profiles.map(p => ({
      id: p.id,
      pts: tips.filter(t => t.user_id === p.id && ids.has(t.match_id)).reduce((s, t) => s + (t.points || 0), 0),
    })).filter(s => s.pts > 0);
    if (scores.length === 0) return;
    const max = Math.max(...scores.map(s => s.pts));
    scores.filter(s => s.pts === max).forEach(s => { stars[s.id] = (stars[s.id] || 0) + 1; });
  });
  return stars;
}

// ── PODSUMOWANIE KOLEJKI ──────────────────────────────────────────────────────
const kickoffKey = m => `${m.match_date}T${m.match_time?.slice(0, 5)}`;

export const pickLabel = (m, pick) =>
  pick === "draw" ? `Remis ${m.home} – ${m.away}` : `Wygrana ${pick === "home" ? m.home : m.away} (${m.home} – ${m.away})`;

// Ostatnia w pełni rozegrana kolejka ligi. Zwraca null, gdy nie ma czego pokazać
// albo gdy wystartował już pierwszy mecz kolejnej kolejki.
function latestCompletedRound(leagueMatches) {
  const byRound = {};
  leagueMatches.forEach(m => { (byRound[m.round] = byRound[m.round] || []).push(m); });
  const completed = Object.entries(byRound)
    .filter(([, ms]) => ms.every(m => m.status === "finished"))
    .map(([round, ms]) => ({ round, ms, last: ms.map(kickoffKey).sort()[ms.length - 1] }))
    .sort((a, b) => a.last.localeCompare(b.last));
  return completed[completed.length - 1] || null;
}

export function buildRoundSummary(leagueMatches, tips, profiles) {
  const latest = latestCompletedRound(leagueMatches);
  if (!latest) return null;

  const nextStarted = leagueMatches.some(m =>
    m.round !== latest.round && kickoffKey(m) > latest.last && (m.status === "finished" || isMatchLocked(m)));
  if (nextStarted) return null;

  const ids = new Set(latest.ms.map(m => m.id));
  const byId = new Map(latest.ms.map(m => [m.id, m]));
  const roundTips = tips.filter(t => ids.has(t.match_id));

  const players = profiles.map(p => {
    const mine = roundTips.filter(t => t.user_id === p.id);
    return { profile: p, tipped: mine.length, pts: mine.reduce((s, t) => s + (t.points || 0), 0), correct: mine.filter(t => t.points > 0).length };
  }).filter(x => x.tipped > 0).sort((a, b) => b.pts - a.pts || b.correct - a.correct);
  if (players.length === 0) return null;

  // Miejsca z remisami: ten sam wynik = to samo miejsce
  const ranked = players.map(x => ({ ...x, pos: 1 + players.filter(y => y.pts > x.pts).length }));

  const maxOdds = Math.max(0, ...roundTips.map(t => t.points || 0));
  const bestTips = maxOdds > 0 ? roundTips.filter(t => t.points === maxOdds) : [];
  const bestNames = [...new Set(bestTips.map(t => profiles.find(p => p.id === t.user_id)?.name).filter(Boolean))];
  const best = bestTips.length ? { odds: maxOdds, names: bestNames, detail: pickLabel(byId.get(bestTips[0].match_id), bestTips[0].pick) } : null;

  const worst = players[players.length - 1];
  const flop = players.length > 1 && worst.pts < players[0].pts ? worst : null;

  return {
    round: latest.round,
    matchCount: latest.ms.length,
    playerCount: players.length,
    top: ranked.filter(x => x.pos <= 3).slice(0, 5),
    best,
    flop,
  };
}

// ── STATYSTYKI GRACZA ─────────────────────────────────────────────────────────
// Liczą się tylko zakończone mecze. Faworyt = wynik z najniższym kursem w meczu.
// Seria: kolejne trafienia według godziny meczu; niewytypowany mecz serii nie przerywa.
export function buildPlayerStats(userId, tips, finishedMatches) {
  const byId = new Map(finishedMatches.map(m => [m.id, m]));
  const mine = tips
    .filter(t => t.user_id === userId && byId.has(t.match_id))
    .map(t => ({ t, m: byId.get(t.match_id) }))
    .sort((a, b) => kickoffKey(a.m).localeCompare(kickoffKey(b.m)));

  let correct = 0, favT = 0, favC = 0, upsT = 0, upsC = 0, run = 0, longest = 0, oddsSum = 0, best = null;
  mine.forEach(({ t, m }) => {
    const odds = { home: parseFloat(m.odds_home), draw: parseFloat(m.odds_draw), away: parseFloat(m.odds_away) };
    const isFav = odds[t.pick] === Math.min(odds.home, odds.draw, odds.away);
    const hit = t.pick === m.result;
    if (hit) {
      correct++; run++; longest = Math.max(longest, run); oddsSum += odds[t.pick];
      if (!best || odds[t.pick] > best.odds) best = { odds: odds[t.pick], detail: pickLabel(m, t.pick) };
    } else {
      run = 0;
    }
    if (isFav) { favT++; if (hit) favC++; } else { upsT++; if (hit) upsC++; }
  });

  const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : null);
  const settled = mine.length;
  return {
    settled, correct, pct: pct(correct, settled),
    favTotal: favT, favCorrect: favC, favPct: pct(favC, favT),
    upsTotal: upsT, upsCorrect: upsC, upsPct: pct(upsC, upsT),
    longestStreak: settled ? longest : null, currentStreak: settled ? run : null,
    bestOdds: best, avgOdds: correct ? oddsSum / correct : null,
  };
}

// Rekordy grupy. Progi chronią przed „100% z jednego typu”.
export function buildGroupRecords(profiles, statsById) {
  const rows = profiles.map(p => ({ p, s: statsById[p.id] })).filter(x => x.s && x.s.settled > 0);
  const top = (fn, filter = () => true) => {
    const c = rows.filter(filter).map(x => ({ p: x.p, v: fn(x.s) })).filter(x => x.v != null && x.v > 0);
    if (c.length === 0) return null;
    const max = Math.max(...c.map(x => x.v));
    return { value: max, people: c.filter(x => x.v === max).map(x => x.p) };
  };
  const recs = [
    ["Najlepsza skuteczność", top(s => s.pct, x => x.s.settled >= 5), v => `${v}%`, "min. 5 typów"],
    ["Najdłuższa seria", top(s => s.longestStreak), v => `${v}`, "trafień z rzędu"],
    ["Król niespodzianek", top(s => s.upsPct, x => x.s.upsTotal >= 3), v => `${v}%`, "min. 3 typy na niespodziankę"],
    ["Najwyższy trafiony kurs", top(s => s.bestOdds?.odds ?? null), v => v.toFixed(2), ""],
  ];
  return recs.filter(([, r]) => r).map(([label, r, fmt, hint]) => ({ label, value: fmt(r.value), people: r.people, hint }));
}

// ── ZMIANY POZYCJI W TABELI ───────────────────────────────────────────────────
// Miejsce przed ostatnią w pełni rozegraną kolejką kontra miejsce teraz.
// Ten sam wynik = to samo miejsce. Zwraca null po pierwszej kolejce sezonu.
export function buildRankChanges(profiles, tips, leagueMatches) {
  const latest = latestCompletedRound(leagueMatches);
  if (!latest) return null;
  const finishedIds = leagueMatches.filter(m => m.status === "finished").map(m => m.id);
  const roundIds = new Set(latest.ms.map(m => m.id));
  const beforeIds = finishedIds.filter(id => !roundIds.has(id));
  if (beforeIds.length === 0) return null;

  const positions = ids => {
    const set = new Set(ids);
    const pts = Object.fromEntries(profiles.map(p => [p.id,
      tips.filter(t => t.user_id === p.id && set.has(t.match_id)).reduce((s, t) => s + (t.points || 0), 0)]));
    const vals = Object.values(pts);
    return Object.fromEntries(profiles.map(p => [p.id, 1 + vals.filter(v => v > pts[p.id]).length]));
  };
  const before = positions(beforeIds);
  const now = positions(finishedIds);
  return {
    round: latest.round,
    changes: Object.fromEntries(profiles.map(p => [p.id, before[p.id] - now[p.id]])),
  };
}
