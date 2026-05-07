import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from '../context/AppContext';

   
const ChatBot = () => {
    const [messages, setMessages] = useState([
        { role: "bot", text: "Hi 👋 I'm your grocery assistant. Ask me anything!" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
     const { backendUrl } = useAppContext();

    const bottomRef = useRef();

    // Auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userText = input;

        console.log(userText)

        setMessages(prev => [...prev, { role: "user", text: userText }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch(`${backendUrl}/api/ai/chat`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: userText })
            });

            if (!res.ok) {
                throw new Error("Request failed");
            }

            const data = await res.json();
            console.log("API RESPONSE:", data);

            setMessages(prev => [
                ...prev,
                {
                    role: "bot",
                    text: data.reply || data.message || "No response from server"
                }
            ]);

        } catch (error) {
            console.log(error);
            setMessages(prev => [
                ...prev,
                {
                    role: "bot",
                    text: "Something went wrong ❌"
                }
            ]);
        }

        setLoading(false);
    };

    // Enter to send, Shift+Enter for new line
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex mt-12 flex-col h-[85vh] w-full max-w-3xl mx-auto border rounded-2xl shadow-lg overflow-hidden bg-white">

            {/* Header */}
            <div className="bg-green-600 text-white p-4 font-
            semibold text-lg flex items-center justify-between">
                <span>Grocery Assistant 🛒</span>
                <span className="text-sm opacity-80">Online</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`
                                px-4 py-2 rounded-2xl max-w-[80%] text-sm whitespace-pre-wrap
                                ${msg.role === "user"
                                    ? "bg-green-500 text-white rounded-br-none"
                                    : "bg-white text-gray-800 border rounded-bl-none shadow-sm"}
                            `}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                    <div className="flex justify-start">
                        <div className="px-4 py-2 rounded-2xl bg-white border text-gray-500 text-sm shadow-sm animate-pulse">
                            Typing...
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t flex items-center gap-2 bg-white">
                <textarea
                    rows="1"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about products, prices, availability..."
                    className="flex-1 resize-none border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-green-400 text-sm"
                />

                <button
                    onClick={sendMessage}
                    disabled={loading}
                    className={`
                        px-5 py-2 rounded-xl text-white text-sm transition
                        ${loading
                            ? "bg-green-300 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"}
                    `}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBot;