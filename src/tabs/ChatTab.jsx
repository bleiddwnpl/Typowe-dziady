import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib";
import { ClubAvatar } from "../components";

// ── CHAT ──────────────────────────────────────────────────────────────────────
export default function ChatTab({ user, profile, profiles }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    supabase.from("messages").select("*").order("created_at").then(({ data }) => {
      setMessages(data || []);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    const ch = supabase.channel("messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, p => {
        setMessages(prev => [...prev, p.new]);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      }).subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  const send = async () => {
    const c = input.trim(); if (!c || sending) return;
    setSending(true); setInput("");
    await supabase.from("messages").insert({ user_id: user.id, user_name: profile?.name || user.email, content: c });
    setSending(false);
  };

  const fmt = ts => new Date(ts).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" });
  const fmtD = ts => new Date(ts).toLocaleDateString("pl-PL", { day: "numeric", month: "long", timeZone: "Europe/Warsaw" });
  const grouped = messages.reduce((acc, m) => { const d = fmtD(m.created_at); if (!acc[d]) acc[d] = []; acc[d].push(m); return acc; }, {});
  const getSP = uid => profiles.find(p => p.id === uid);

  return (
    <div className="chat-wrap">
      <div className="chat-msgs">
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
