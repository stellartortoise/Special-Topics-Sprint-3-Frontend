import { useState, useRef, useEffect } from "react";
import '../App.css'; // Make sure this is imported!

const API_BASE = "http://localhost:8080/chat";

interface Message {
    role: "user" | "assistant";
    text: string;
}

function generateId(): string {
    return crypto.randomUUID();
}

export default function ChatWidget() {
    const [open, setOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", text: "SYSTEM ONLINE. HOW CAN I ASSIST?" }
    ]);
    const [input, setInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const conversationId = useRef<string>(generateId());
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async (): Promise<void> => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;
        setMessages(prev => [...prev, { role: "user", text: trimmed }]);
        setInput("");
        setLoading(true);
        try {
            const params = new URLSearchParams({
                message: trimmed,
                conversationId: conversationId.current,
            });
            const res = await fetch(`${API_BASE}?${params}`, { method: "GET" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const reply = await res.text();
            setMessages(prev => [...prev, { role: "assistant", text: reply }]);
        } catch (err) {
            console.error("Fetch error:", err);
            setMessages(prev => [...prev, { role: "assistant", text: "CONNECTION LOST. PLEASE RETRY." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="chat-container">
            {/* Chat Window */}
            {open && (
                <div className="chat-window">
                    {/* Header */}
                    <div className="chat-header">
                        <span className="online-indicator" />
                        <div className="header-info">
                            <div className="ai-title">A.I. CONSTRUCT</div>
                            <div className="ai-status">CONNECTION SECURE</div>
                        </div>
                        <button className="close-btn" onClick={() => setOpen(false)}>X</button>
                    </div>

                    {/* Messages */}
                    <div className="chat-body">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-msg-wrapper ${msg.role === "user" ? "wrapper-user" : "wrapper-ai"}`}>
                                <div className={`chat-msg ${msg.role === "user" ? "msg-user" : "msg-ai"}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {loading && (
                            <div className="chat-msg-wrapper wrapper-ai">
                                <div className="chat-msg msg-ai loading-dots">
                                    {([0, 0.2, 0.4] as number[]).map((d, i) => (
                                        <span key={i} className="dot" style={{ animationDelay: `${d}s` }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input Area */}
                    <div className="chat-footer">
                        <input
                            autoFocus
                            type="text"
                            className="chat-input"
                            value={input}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="> ENTER COMMAND..."
                            disabled={loading}
                        />
                        <button
                            className="chat-send-btn"
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                        >
                            SEND
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <button className="neon-button chat-fab" onClick={() => setOpen(o => !o)}>
                {open ? "CLOSE TERMINAL" : "OPEN TERMINAL"}
            </button>
        </div>
    );
}