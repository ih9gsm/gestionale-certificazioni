import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LibrettiForm() {
  const [clients, setClients] = useState([]);
  const [installers, setInstallers] = useState([]);
  const [formData, setFormData] = useState({
    client_id: '',
    installer_id: '',
    tipo_impianto: 'climatizzazione_invernale',
    indirizzo_impianto: '',
    tipo_generatore: '',
    matricola_generatore: '',
    potenza_termica: '',
    data_compilazione: new Date().toISOString().split('T')[0]
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
      await axios.post('http://localhost:3000/api/libretti', formData);
      navigate('/libretti');
    } catch (err) {
      console.error(err);
      alert('Error creating Libretto');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Nuovo Libretto di Impianto (DPR 74/2013)</h1>

      <div className="bg-white p-6 rounded shadow border-t-4 border-green-500">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label className="block font-semibold mb-1">Manutentore / Installatore</label>
            <select name="installer_id" value={formData.installer_id} onChange={handleChange} className="w-full border p-2 rounded" required>
              <option value="">-- Seleziona Impresa --</option>
              {installers.map(i => <option key={i.id} value={i.id}>{i.company_name} (Resp. {i.responsible_person})</option>)}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Responsabile dell'Impianto (Proprietario/Occupante)</label>
            <select name="client_id" value={formData.client_id} onChange={handleChange} className="w-full border p-2 rounded" required>
              <option value="">-- Seleziona Cliente --</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Tipologia di Impianto</label>
            <select name="tipo_impianto" value={formData.tipo_impianto} onChange={handleChange} className="w-full border p-2 rounded" required>
              <option value="climatizzazione_invernale">Climatizzazione Invernale (Riscaldamento)</option>
              <option value="climatizzazione_estiva">Climatizzazione Estiva (Condizionamento)</option>
              <option value="misto">Misto (Invernale + Estiva)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Indirizzo dell'impianto</label>
            <input type="text" name="indirizzo_impianto" value={formData.indirizzo_impianto} onChange={handleChange} className="w-full border p-2 rounded" required placeholder="Via, Città, Prov..." />
          </div>

          <div className="border p-4 rounded bg-gray-50">
            <h3 className="font-semibold mb-2">Dati Generatore Principale (Opzionale)</h3>
            <div className="flex flex-col gap-2">
              <input type="text" name="tipo_generatore" value={formData.tipo_generatore} onChange={handleChange} className="border p-2 rounded" placeholder="Tipo Generatore (es. Caldaia a condensazione, Pompa di calore)" />
              <input type="text" name="matricola_generatore" value={formData.matricola_generatore} onChange={handleChange} className="border p-2 rounded" placeholder="Matricola" />
              <input type="text" name="potenza_termica" value={formData.potenza_termica} onChange={handleChange} className="border p-2 rounded" placeholder="Potenza Termica Nominale (kW)" />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Data Compilazione</label>
            <input type="date" name="data_compilazione" value={formData.data_compilazione} onChange={handleChange} className="border p-2 rounded" required />
          </div>

          <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 mt-4">
            Genera Libretto
          </button>
        </form>
      </div>
    </div>
  );
}
