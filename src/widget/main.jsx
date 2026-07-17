import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");
const VISITOR_KEY_PREFIX = "aiflow_visitor_";

function getOrCreateVisitorId(botId) {
  const key = `${VISITOR_KEY_PREFIX}${botId}`;
  let id = localStorage.getItem(key);
  if (!id) {
    id = `visitor_${Math.random().toString(36).slice(2)}${Date.now()}`;
    localStorage.setItem(key, id);
  }
  return id;
}

function Widget({ botId, color, position }) {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const visitorId = useRef(getOrCreateVisitorId(botId));

  // Fetch real public config (name/color/position) for this bot.
  useEffect(() => {
    fetch(`${API_BASE_URL}/widget/${botId}/config`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(setConfig)
      .catch(() => setConfig({ bot_name: "Chat", color, position }));
  }, [botId, color, position]);

  // Open the websocket only once the visitor actually opens the widget.
  useEffect(() => {
    if (!open || socketRef.current) return;
    const socket = new WebSocket(`${WS_BASE_URL}/ws/widget/${botId}?visitor_id=${visitorId.current}`);
    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.role === "assistant") {
          setMessages((m) => [...m, { role: "assistant", content: data.content }]);
        }
      } catch {
        // ignore malformed frames
      }
    };
    socketRef.current = socket;
    return () => socket.close();
  }, [open, botId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    socketRef.current.send(text);
    setInput("");
  }

  const accent = config?.color || color;
  const pos = config?.position || position;
  const side = pos === "bottom-left" ? { left: 20 } : { right: 20 };

  return (
    <div style={{ position: "fixed", bottom: 20, zIndex: 999999, fontFamily: "sans-serif", ...side }}>
      {open && (
        <div
          style={{
            width: 320,
            height: 420,
            background: "#0a0a12",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14,
            marginBottom: 12,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}
        >
          <div style={{ background: accent, padding: "12px 16px", color: "#fff", fontWeight: 600, fontSize: 14 }}>
            {config?.bot_name || "Chat"}
          </div>
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.length === 0 && (
              <div style={{ color: "#94a3b8", fontSize: 13, margin: "auto", textAlign: "center" }}>
                {connected ? "Ask us anything…" : "Connecting…"}
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  background: m.role === "user" ? accent : "rgba(255,255,255,0.08)",
                  color: "#fff",
                  borderRadius: 10,
                  padding: "8px 12px",
                  fontSize: 13,
                  maxWidth: "82%",
                }}
              >
                {m.content}
              </div>
            ))}
          </div>
          <form onSubmit={send} style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              style={{ flex: 1, background: "transparent", border: "none", color: "#fff", padding: 12, fontSize: 13, outline: "none" }}
            />
            <button type="submit" style={{ background: "none", border: "none", color: accent, padding: "0 14px", cursor: "pointer", fontWeight: 600 }}>
              Send
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: accent,
          border: "none",
          color: "#fff",
          fontSize: 22,
          cursor: "pointer",
          boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
        }}
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}

(function mount() {
  const scriptTag = document.currentScript || document.querySelector("script[data-bot-id]");
  if (!scriptTag) return;

  const botId = scriptTag.getAttribute("data-bot-id");
  const color = scriptTag.getAttribute("data-color") || "#6366f1";
  const position = scriptTag.getAttribute("data-position") || "bottom-right";
  if (!botId) {
    console.error("[AI FLOW widget] missing data-bot-id attribute on the embed script tag");
    return;
  }

  const container = document.createElement("div");
  document.body.appendChild(container);
  createRoot(container).render(<Widget botId={botId} color={color} position={position} />);
})();
