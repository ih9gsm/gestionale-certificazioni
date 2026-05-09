import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Settings() {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/settings');
        setAiEnabled(res.data.ai_agent_enabled || false);
      } catch (err) {
        console.error("Error fetching settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = async () => {
    const newValue = !aiEnabled;
    setAiEnabled(newValue);
    try {
      await axios.post('http://localhost:3000/api/settings', { ai_agent_enabled: newValue });
    } catch (err) {
      console.error("Error updating settings", err);
      // Revert if error
      setAiEnabled(!newValue);
      alert("Errore durante il salvataggio delle impostazioni.");
    }
  };

  if (loading) return <div className="p-4">Caricamento impostazioni...</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Impostazioni Applicazione</h1>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Assistente Virtuale (Chat)</h2>
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <p className="font-medium text-gray-800">Abilita Chatbot DICO</p>
            <p className="text-sm text-gray-500">Mostra l'assistente virtuale in basso a destra per compilare la DICO guidata.</p>
          </div>
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${aiEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${aiEnabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
