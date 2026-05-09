import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DiriForm() {
  const [clients, setClients] = useState([]);
  const [installers, setInstallers] = useState([]);
  const [formData, setFormData] = useState({
    client_id: '',
    installer_id: '',
    impianto_tipo: 'elettrico',
    descrizione_impianto: '',
    indirizzo_impianto: '',
    anno_realizzazione: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, installersRes] = await Promise.all([
          axios.get('http://localhost:3000/api/clients'),
          axios.get('http://localhost:3000/api/installers')
        ]);
        setClients(clientsRes.data);
        setInstallers(installersRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/diris', formData);
      navigate('/diris');
    } catch (err) {
      console.error(err);
      alert('Error creating DIRI');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Dichiarazione di Rispondenza (DIRI)</h1>

      <div className="bg-white p-6 rounded shadow border-t-4 border-yellow-500">
        <p className="text-sm text-gray-600 mb-4">La DIRI viene compilata in sostituzione della DICO per impianti eseguiti prima del 27/03/2008.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label className="block font-semibold mb-1">Professionista/Tecnico Compilatore</label>
            <select name="installer_id" value={formData.installer_id} onChange={handleChange} className="w-full border p-2 rounded" required>
              <option value="">-- Seleziona Tecnico --</option>
              {installers.map(i => <option key={i.id} value={i.id}>{i.company_name} (Resp. {i.responsible_person})</option>)}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Committente / Proprietario</label>
            <select name="client_id" value={formData.client_id} onChange={handleChange} className="w-full border p-2 rounded" required>
              <option value="">-- Seleziona Cliente --</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Tipologia Impianto</label>
            <select name="impianto_tipo" value={formData.impianto_tipo} onChange={handleChange} className="w-full border p-2 rounded" required>
              <option value="elettrico">Lettera A - Impianto Elettrico</option>
              <option value="radiotelevisivo">Lettera B - Impianto Radiotelevisivo</option>
              <option value="riscaldamento">Lettera C - Impianto di Riscaldamento / Climatizzazione</option>
              <option value="idrico">Lettera D - Impianto Idrico / Sanitario</option>
              <option value="gas">Lettera E - Impianto a Gas</option>
              <option value="antincendio">Lettera G - Impianto Antincendio</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Anno presunto di realizzazione</label>
            <input type="text" name="anno_realizzazione" value={formData.anno_realizzazione} onChange={handleChange} className="w-full border p-2 rounded" required placeholder="es. 1998" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Descrizione dell'impianto</label>
            <textarea name="descrizione_impianto" value={formData.descrizione_impianto} onChange={handleChange} className="w-full border p-2 rounded" rows="3" required placeholder="Descrizione sommaria dello stato di fatto..."></textarea>
          </div>

          <div>
            <label className="block font-semibold mb-1">Indirizzo dell'impianto</label>
            <input type="text" name="indirizzo_impianto" value={formData.indirizzo_impianto} onChange={handleChange} className="w-full border p-2 rounded" required placeholder="Via, Città, Prov..." />
          </div>

          <button type="submit" className="bg-yellow-600 text-white font-bold py-2 px-4 rounded hover:bg-yellow-700 mt-4">
            Genera DIRI
          </button>
        </form>
      </div>
    </div>
  );
}
