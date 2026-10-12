import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { MessageCircle, Send, X } from 'lucide-react';
import { useAuth } from '../useAuth';

const GREETING = "Hi, I'm Nirmal! Ask me about your order, our products, or anything else you're curious about.";

function Chatbot() {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, loading]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
        // The greeting is UI-only, so it isn't sent to the model.
        { messages: next.slice(1) },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setMessages([...next, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      const msg = err.response?.data?.error || "Sorry, I couldn't reach the server. Please try again.";
      setMessages([...next, { role: 'assistant', content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {open && (
        <div className="mb-3 w-[calc(100vw-2.5rem)] sm:w-96 h-[28rem] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
          <div className="bg-orange-600 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-serif font-bold leading-tight">Nirmal</p>
              <p className="text-xs text-orange-100">Threaded Things assistant</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="hover:bg-white/10 rounded-full p-1">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-orange-600 text-white rounded-br-sm'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-bl-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl rounded-bl-sm bg-white border border-stone-200 text-sm text-stone-400">
                  Nirmal is typing...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={send} className="flex items-center gap-2 p-3 border-t border-stone-200 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              maxLength={500}
              className="flex-1 px-3 py-2 text-sm rounded-full border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-500 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close chat' : 'Chat with Nirmal'}
        className="ml-auto flex items-center gap-2 bg-orange-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-orange-500 transition-colors"
      >
        <MessageCircle size={22} />
        {!open && <span className="text-sm font-semibold">Ask Nirmal</span>}
      </button>
    </div>
  );
}

export default Chatbot;
