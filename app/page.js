"use client";

import { useState, useRef, useEffect } from "react";

const ORANGE = "#F26522";
const BLACK = "#1A1A1A";
const DARK = "#0D0D0D";
const GRAY = "#2A2A2A";

function TigerLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" fill={ORANGE} />
      <circle cx="50" cy="50" r="42" fill={BLACK} />
      <text
        x="50" y="62" textAnchor="middle" fontSize="36"
        fontWeight="bold" fill={ORANGE} fontFamily="Arial Black, sans-serif"
      >TT</text>
      <path d="M25 25 L35 35 M75 25 L65 35" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
      <path d="M20 20 L32 32 M80 20 L68 32" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 6, padding: "8px 0", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 8, height: 8, borderRadius: "50%", background: ORANGE,
            animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function Message({ text, isUser }) {
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 12 }}>
      {!isUser && (
        <div style={{ marginRight: 10, flexShrink: 0, marginTop: 4 }}>
          <TigerLogo size={32} />
        </div>
      )}
      <div
        style={{
          maxWidth: "75%", padding: "12px 16px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser ? ORANGE : GRAY,
          color: "#fff", fontSize: 15, lineHeight: 1.5,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          whiteSpace: "pre-wrap",
        }}
      >
        {text}
      </div>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Send initial greeting
  useEffect(() => {
    if (!greeting) {
      setGreeting(true);
      setIsTyping(true);
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Greet the user with a short one-liner. The vibe is: ask me anything, because we're living like it's 2005 every day and every minute. Keep it to 1-2 sentences max." }],
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          setMessages([{ text: data.reply, role: "assistant" }]);
          setIsTyping(false);
        })
        .catch(() => {
          setMessages([{ text: "Ask me anything â because we're living like it's 2005, every day and every minute ð¯", role: "assistant" }]);
          setIsTyping(false);
        });
    }
  }, [greeting]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function handleSend() {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput("");

    const newMessages = [...messages, { text: userMsg, role: "user" }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      const data = await res.json();
      setMessages([...newMessages, { text: data.reply || data.error, role: "assistant" }]);
    } catch {
      setMessages([...newMessages, { text: "Sorry mate, something went wrong. Give it another crack!", role: "assistant" }]);
    }
    setIsTyping(false);
  }

  const quickQuestions = ["Tell me about 2005", "Give me a recipe with a Tigers twist", "Motivate me for the gym", "What's Leichhardt like?"];
  const stats = [
    { label: "Premierships", value: "1 & counting" },
    { label: "Home", value: "Leichhardt" },
    { label: "Colours", value: "ð¤ð§¡" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: DARK }}>
      {/* Tiger stripe top bar */}
      <div style={{ height: 6, background: `repeating-linear-gradient(90deg, ${ORANGE} 0px, ${ORANGE} 40px, ${BLACK} 40px, ${BLACK} 80px)` }} />

      {/* Header */}
      <header style={{ background: BLACK, borderBottom: `2px solid ${ORANGE}`, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <TigerLogo size={48} />
          <div>
            <h1 style={{ margin: 0, color: "#fff", fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>
              TIGER <span style={{ color: ORANGE }}>TALK</span>
            </h1>
            <p style={{ margin: 0, color: "#888", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>Chat About Anything</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", animation: "pulse 2s infinite" }} />
          <span style={{ color: "#4ade80", fontSize: 12 }}>Online</span>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 12, padding: "16px 0", overflowX: "auto" }}>
          {stats.map((s) => (
            <div key={s.label} style={{ flex: 1, minWidth: 100, background: GRAY, borderRadius: 12, padding: "12px 16px", textAlign: "center", border: "1px solid #333" }}>
              <div style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
              <div style={{ color: ORANGE, fontSize: 18, fontWeight: 700, marginTop: 4 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Chat box */}
        <div style={{ background: BLACK, borderRadius: 16, border: "1px solid #333", height: "calc(100vh - 320px)", minHeight: 400, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
            {messages.map((m, i) => (
              <Message key={i} text={m.text} isUser={m.role === "user"} />
            ))}
            {isTyping && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <TigerLogo size={32} />
                <TypingDots />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid #333", background: GRAY }}>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me literally anything..."
                style={{
                  flex: 1, padding: "12px 16px", borderRadius: 24,
                  border: "1px solid #444", background: BLACK,
                  color: "#fff", fontSize: 15, outline: "none",
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                style={{
                  padding: "12px 24px", borderRadius: 24, border: "none",
                  background: input.trim() && !isTyping ? ORANGE : "#555",
                  color: "#fff", fontWeight: 700, fontSize: 15,
                  cursor: input.trim() && !isTyping ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >Send</button>
            </div>
            <p style={{ margin: "8px 0 0", color: "#666", fontSize: 11, textAlign: "center" }}>
              Powered by AI Â· Not affiliated with Wests Tigers or the NRL
            </p>
          </div>
        </div>

        {/* Quick questions */}
        <div style={{ display: "flex", gap: 8, padding: "16px 0", flexWrap: "wrap" }}>
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => { setInput(q); inputRef.current?.focus(); }}
              style={{
                padding: "8px 16px", borderRadius: 20,
                border: `1px solid ${ORANGE}40`, background: "transparent",
                color: ORANGE, fontSize: 13, cursor: "pointer",
              }}
            >{q}</button>
          ))}
        </div>

        <footer style={{ textAlign: "center", padding: "24px 0", borderTop: "1px solid #222" }}>
          <p style={{ color: "#555", fontSize: 12, margin: 0 }}>
            Fan-made project Â· Not affiliated with Wests Tigers, NRL, or any official organisation
          </p>
        </footer>
      </div>
    </div>
  );
}
