import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ChatWidget() {
  const [enabled, setEnabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  // Check if agent is enabled
  useEffect(() => {
    const checkSettings = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/settings');
        setEnabled(res.data.ai_agent_enabled);
      } catch (err) {
        console.error("Error fetching settings", err);
      }
    };
    checkSettings();
    // Generate a simple random session ID for the browser session
    setSessionId(Math.random().toString(36).substring(7));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOpen = async () => {
    setIsOpen(true);
    // If opening for the first time, trigger the welcome message
    if (messages.length === 0) {
      sendMessage(''); // send empty message to trigger step 0
    }
  };

  const sendMessage = async (text) => {
    if (text) {
      setMessages(prev => [...prev, { text, sender: 'user' }]);
    }
    setInput('');
    try {
      const res = await axios.post('http://localhost:3000/api/chat', { session_id: sessionId, message: text });
      setMessages(prev => [...prev, { text: res.data.reply, sender: 'bot' }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Errore di connessione.", sender: 'bot' }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
  };

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-lg shadow-xl flex flex-col border border-gray-200">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <span className="font-semibold">mr.dico Assistant</span>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">&times;</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto bg-gray-50 flex flex-col gap-2">
            {messages.map((msg, i) => (
              <div key={i} className={`max-w-[80%] rounded p-2 text-sm ${msg.sender === 'user' ? 'bg-blue-100 text-blue-900 self-end' : 'bg-white border text-gray-800 self-start'}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-2 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
              placeholder="Scrivi qui..."
            />
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Invia</button>
          </form>
        </div>
      )}
    </div>
  );
}
