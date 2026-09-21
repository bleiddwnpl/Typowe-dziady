import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { supabase } from "../lib";
import { ClubAvatar } from "../components";

const PAGE = 100; // ile wiadomości wczytywać naraz

// ── CZAT ──────────────────────────────────────────────────────────────────────
export default function ChatTab({ user, profile, profiles }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const bottomRef = useRef(null);
  const listRef = useRef(null);
  const keepScroll = useRef(null); // odległość od dołu do przywrócenia po doładowaniu starszych

  const scrollToBottom = delay => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), delay);

  // Najnowsze wiadomości + nowe na żywo
  useEffect(() => {
    supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(PAGE)
      .then(({ data }) => {
        const rows = data || [];
        setMessages([...rows].reverse());
        setHasMore(rows.length === PAGE);
        scrollToBottom(100);
      });
    const ch = supabase.channel("messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, p => {
        setMessages(prev => prev.some(m => m.id === p.new.id) ? prev : [...prev, p.new]);
        scrollToBottom(50);
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  // Po doładowaniu starszych: zostań w tym samym miejscu zamiast skakać na górę
  useLayoutEffect(() => {
    const el = listRef.current;
    if (keepScroll.current == null || !el) return;
    el.scrollTop = el.scrollHeight - keepScroll.current;
    keepScroll.current = null;
  }, [messages]);

  const loadOlder = async () => {
    if (loadingOlder || messages.length === 0) return;
    setLoadingOlder(true);
    const { data } = await supabase.from("messages").select("*")
      .lt("created_at", messages[0].created_at)
      .order("created_at", { ascending: false }).limit(PAGE);
    const rows = data || [];
    const el = listRef.current;
    if (el) keepScroll.current = el.scrollHeight - el.scrollTop;
    setMessages(prev => [...[...rows].reverse(), ...prev]);
    setHasMore(rows.length === PAGE);
    setLoadingOlder(false);
  };

  const send = async () => {
    const c = input.trim(); if (!c || sending) return;
    setSending(true); setInput("");
    const { error } = await supabase.from("messages").insert({ user_id: user.id, user_name: profile?.name || user.email, content: c });
    if (error) setInput(c); // nie zgub tekstu, gdy wysyłka się nie uda
    setSending(false);
  };

  const fmt = ts => new Date(ts).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" });
  const fmtD = ts => new Date(ts).toLocaleDateString("pl-PL", { day: "numeric", month: "long", timeZone: "Europe/Warsaw" });
  const grouped = messages.reduce((acc, m) => { const d = fmtD(m.created_at); if (!acc[d]) acc[d] = []; acc[d].push(m); return acc; }, {});
  const getSP = uid => profiles.find(p => p.id === uid);

  return (
    <div className="chat-wrap">
      <div className="chat-msgs" ref={listRef}>
        {hasMore && (
          <div style={{ textAlign: "center", margin: "6px 0 4px" }}>
            <button onClick={loadOlder} disabled={loadingOlder}
              style={{ padding: "7px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, color: "rgba(255,255,255,0.55)", fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: loadingOlder ? "default" : "pointer" }}>
              {loadingOlder ? "Wczytywanie..." : "Pokaż starsze wiadomości"}
            </button>
          </div>
        )}
        {messages.length === 0 && <div className="empty"><div className="ei">💬</div><div className="et">Brak wiadomości</div><div className="es">Zacznij rozmowę</div></div>}
        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            <div className="cdt"><span>{date}</span></div>
            {msgs.map((msg, i) => {
              const isMe = msg.user_id === user.id;
              const sp = getSP(msg.user_id);
              const showName = !msgs[i + 1] || msgs[i + 1].user_id !== msg.user_id;
              return (
                <div key={msg.id} className="cbw" style={{ alignItems: isMe ? "flex-end" : "flex-start" }}>
                  <div className={`crow ${isMe ? "me" : ""}`}>
                    {!isMe && showName && <ClubAvatar favoriteTeam={sp?.favorite_team} name={msg.user_name} size={28} />}
                    {!isMe && !showName && <div style={{ width: 28, flexShrink: 0 }} />}
                    <div className={`cb ${isMe ? "mine" : "theirs"}`}>{msg.content}</div>
                  </div>
                  {showName && !isMe && <div className="csnd">{msg.user_name}</div>}
                  {showName && isMe && <div className="ctm">{fmt(msg.created_at)}</div>}
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="chat-bar">
        <input className="cin" placeholder="Wiadomość..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} maxLength={500} />
        <button className="csend" onClick={send} disabled={!input.trim() || sending}>↑</button>
      </div>
    </div>
  );
}
