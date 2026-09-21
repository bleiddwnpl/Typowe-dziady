import { useState, useEffect, useRef, useCallback } from "react";
import { supabase, PICK_LABELS, TEAM_LOGOS, isMatchLocked } from "./lib";

// Cały stan danych aplikacji: ładowanie, zapisy do bazy i aktualizacje na żywo.
// Zakładki tylko wyświetlają dane i wołają akcje stąd.
export function useAppData(user, profile) {
  const [leagues, setLeagues] = useState([]);
  const [matches, setMatches] = useState([]);
  const [tips, setTips] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [polls, setPolls] = useState([]);
  const [pollOptions, setPollOptions] = useState([]);
  const [pollVotes, setPollVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [tipStats, setTipStats] = useState({}); // { match_id: { home, draw, away, tipped: [user_id] } }

  // Aktualne mecze dla subskrypcji realtime (bez ponownego łączenia przy każdej zmianie)
  const matchesRef = useRef([]);
  matchesRef.current = matches;

  const toastTimer = useRef(null);
  const showToast = useCallback(msg => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  // ── ŁADOWANIE ───────────────────────────────────────────────────────────────
  // Rozkład typów przed meczem: tylko liczby i kto typował — bez zdradzania wyborów
  const loadStats = useCallback(async () => {
    const { data, error } = await supabase.rpc("match_tip_stats");
    if (error || !data) return;
    const map = {};
    data.forEach(r => { map[r.match_id] = { home: r.home_count, draw: r.draw_count, away: r.away_count, tipped: r.tipped_user_ids || [] }; });
    setTipStats(map);
  }, []);

  // Po rozpoczęciu meczu baza odsłania typy — dociągamy je dla tego meczu
  const refreshMatchTips = useCallback(async matchId => {
    const { data } = await supabase.from("tips").select("*").eq("match_id", matchId);
    if (!data) return;
    setTips(prev => [...prev.filter(t => t.match_id !== matchId), ...data]);
  }, []);

  const load = useCallback(async () => {
    const [{ data: lg }, { data: m }, { data: p }, { data: pl }, { data: po }, { data: pv }] = await Promise.all([
      supabase.from("leagues").select("*").order("name"),
      supabase.from("matches").select("*").order("match_date").order("match_time"),
      supabase.from("profiles").select("*"),
      supabase.from("polls").select("*").order("created_at", { ascending: false }),
      supabase.from("poll_options").select("*"),
      supabase.from("poll_votes").select("*"),
    ]);
    // Typy pobieramy stronami — Supabase zwraca maks. 1000 wierszy naraz
    let allTips = [], from = 0;
    while (true) {
      const { data: page, error } = await supabase.from("tips").select("*").range(from, from + 999);
      if (error || !page || page.length === 0) break;
      allTips = [...allTips, ...page];
      if (page.length < 1000) break;
      from += 1000;
    }
    setLeagues(lg || []);
    setMatches(m || []);
    setTips(allTips);
    setProfiles(p || []);
    setPolls(pl || []);
    setPollOptions(po || []);
    setPollVotes(pv || []);
    await loadStats();
    setLoading(false);
  }, [loadStats]);

  useEffect(() => { load(); }, [load]);

  // Rozkład typów na żywo: po każdym typie gracz wysyła wszystkim sygnał „zmiana” (bez treści typu),
  // a każdy telefon pobiera wtedy świeże liczby z bazy
  const statsChannelRef = useRef(null);
  useEffect(() => {
    const ch = supabase.channel("tip-stats")
      .on("broadcast", { event: "changed" }, () => { loadStats(); })
      .subscribe();
    statsChannelRef.current = ch;
    const i = setInterval(loadStats, 60000); // zapas, gdyby jakiś sygnał nie dotarł
    return () => { clearInterval(i); supabase.removeChannel(ch); statsChannelRef.current = null; };
  }, [loadStats]);

  // ── REALTIME: typy innych graczy ────────────────────────────────────────────
  useEffect(() => {
    const ch = supabase.channel("tips-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "tips" }, ({ new: t }) => {
        setTips(prev => prev.some(x => x.id === t.id) ? prev : [...prev, t]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "tips" }, ({ new: t }) => {
        setTips(prev => prev.map(x => x.id === t.id ? t : x));
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  // ── REALTIME: wyniki meczów ─────────────────────────────────────────────────
  useEffect(() => {
    const ch = supabase.channel("matches-realtime")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "matches" }, ({ new: m }) => {
        const before = matchesRef.current.find(x => x.id === m.id);
        setMatches(prev => prev.map(x => x.id === m.id ? m : x));
        if (m.status === "finished" && before?.status !== "finished") {
          showToast(`⚽ Wynik: ${m.home} ${PICK_LABELS[m.result]} ${m.away}`);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [showToast]);

  // ── REALTIME: kto jest online ───────────────────────────────────────────────
  useEffect(() => {
    const ch = supabase.channel("presence-online", { config: { presence: { key: user.id } } });
    ch.on("presence", { event: "sync" }, () => {
      setOnlineUsers(Object.values(ch.presenceState()).map(arr => arr[0]));
    });
    ch.subscribe(async status => {
      if (status === "SUBSCRIBED") await ch.track({ user_id: user.id, name: profile?.name || "Gracz" });
    });
    return () => { supabase.removeChannel(ch); };
  }, [user.id, profile?.name]);

  // ── AKCJE GRACZA ────────────────────────────────────────────────────────────
  const saveFavoriteTeam = async team => {
    const { error } = await supabase.from("profiles").update({ favorite_team: team }).eq("id", user.id);
    if (error) { showToast("⚠️ Błąd zapisu klubu"); return false; }
    showToast(`Kibicujesz: ${team}!`);
    await load();
    return true;
  };

  const placeTip = async (matchId, pick) => {
    const match = matches.find(m => m.id === matchId);
    if (!match || isMatchLocked(match)) { showToast("⛔ Typowanie zamknięte"); return; }
    const { data, error } = await supabase.from("tips")
      .upsert({ user_id: user.id, match_id: matchId, pick, points: 0 }, { onConflict: "user_id,match_id" })
      .select().single();
    if (error) { showToast("⚠️ Błąd zapisu typu"); return; }
    setTips(prev => {
      const idx = prev.findIndex(t => t.user_id === user.id && t.match_id === matchId);
      if (idx >= 0) { const u = [...prev]; u[idx] = data; return u; }
      return [...prev, data];
    });
    showToast(`Typ: ${PICK_LABELS[pick]} · +${parseFloat(match[`odds_${pick}`]).toFixed(2)} pkt`);
    loadStats();
    statsChannelRef.current?.send({ type: "broadcast", event: "changed", payload: {} });
  };

  const castVote = async (pollId, optionId) => {
    const { data, error } = await supabase.from("poll_votes")
      .insert({ poll_id: pollId, option_id: optionId, user_id: user.id })
      .select().single();
    if (error) { showToast("⚠️ Błąd zapisu głosu"); return; }
    setPollVotes(prev => [...prev, data]);
    showToast("🗳️ Głos oddany!");
  };

  // ── AKCJE ADMINA ────────────────────────────────────────────────────────────
  const matchPayload = d => ({
    league_id: d.league_id, home: d.home, away: d.away,
    home_logo: TEAM_LOGOS[d.home] || null, away_logo: TEAM_LOGOS[d.away] || null,
    match_date: d.match_date, match_time: d.match_time, round: d.round,
    odds_home: parseFloat(d.odds_home), odds_draw: parseFloat(d.odds_draw), odds_away: parseFloat(d.odds_away),
  });

  const addMatch = async d => {
    if (!d.league_id || !d.home || !d.away || !d.match_date || !d.odds_home) { showToast("Wypełnij wszystkie pola"); return false; }
    const { error } = await supabase.from("matches").insert({ ...matchPayload(d), status: "upcoming", result: null });
    if (error) { showToast("⚠️ Błąd dodawania meczu"); return false; }
    await load(); showToast("Mecz dodany!");
    return true;
  };

  const updateMatch = async (id, d) => {
    if (!d.home || !d.away || !d.match_date) { showToast("Wypełnij wszystkie pola"); return false; }
    const { error } = await supabase.from("matches").update(matchPayload(d)).eq("id", id);
    if (error) { showToast("⚠️ Błąd zapisu meczu"); return false; }
    await load(); showToast("Zaktualizowano!");
    return true;
  };

  // Wynik + punkty wszystkich graczy zapisywane w bazie naraz (funkcja save_match_result)
  const saveResult = async (matchId, result) => {
    const { error } = await supabase.rpc("save_match_result", { p_match_id: matchId, p_result: result });
    if (error) { showToast(`⚠️ ${error.message}`); return false; }
    await load(); showToast("Wynik zapisany!");
    return true;
  };

  const addPoll = async (leagueId, question, options) => {
    if (!question.trim()) { showToast("Wpisz pytanie"); return false; }
    const valid = options.filter(o => o.trim());
    if (valid.length < 2) { showToast("Dodaj co najmniej 2 odpowiedzi"); return false; }
    const { data: poll, error } = await supabase.from("polls")
      .insert({ league_id: leagueId, question: question.trim(), status: "active", closes_at: null })
      .select().single();
    if (error) { showToast("⚠️ Błąd tworzenia ankiety"); return false; }
    for (const label of valid) {
      await supabase.from("poll_options").insert({ poll_id: poll.id, label: label.trim() });
    }
    await load(); showToast("✓ Ankieta dodana!");
    return true;
  };

  const closePoll = async pollId => {
    await supabase.from("polls").update({ status: "closed" }).eq("id", pollId);
    await load(); showToast("Ankieta zamknięta");
  };

  const deletePoll = async pollId => {
    await supabase.from("poll_votes").delete().eq("poll_id", pollId);
    await supabase.from("poll_options").delete().eq("poll_id", pollId);
    await supabase.from("polls").delete().eq("id", pollId);
    await load(); showToast("Ankieta usunięta");
  };

  return {
    leagues, matches, tips, tipStats, profiles, polls, pollOptions, pollVotes, loading, toast, onlineUsers,
    actions: { saveFavoriteTeam, placeTip, castVote, refreshMatchTips, addMatch, updateMatch, saveResult, addPoll, closePoll, deletePoll },
  };
}
