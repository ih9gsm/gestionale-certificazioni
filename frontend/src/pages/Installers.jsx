import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Installers() {
  const [installers, setInstallers] = useState([]);
  const [formData, setFormData] = useState({ company_name: '', responsible_person: '', vat_number: '', address: '' });

  const fetchInstallers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/installers');
      setInstallers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInstallers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/installers', formData);
      setFormData({ company_name: '', responsible_person: '', vat_number: '', address: '' });
      fetchInstallers();
    } catch (err) {
      console.error(err);
      alert('Error creating installer');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestione Installatori / Imprese</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Aggiungi Installatore</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input className="border p-2 rounded" type="text" name="company_name" placeholder="Ragione Sociale Impresa" value={formData.company_name} onChange={handleChange} required />
          <input className="border p-2 rounded" type="text" name="responsible_person" placeholder="Responsabile Tecnico / Titolare" value={formData.responsible_person} onChange={handleChange} required />
          <input className="border p-2 rounded" type="text" name="vat_number" placeholder="Partita IVA" value={formData.vat_number} onChange={handleChange} required />
          <input className="border p-2 rounded" type="text" name="address" placeholder="Indirizzo Sede" value={formData.address} onChange={handleChange} required />
          <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">Salva Installatore</button>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Elenco Installatori</h2>
        <ul>
          {installers.map(inst => (
            <li key={inst.id} className="border-b py-2">
              <span className="font-semibold">{inst.company_name}</span> (Resp: {inst.responsible_person})<br/>
              <span className="text-sm text-gray-600">{inst.address} - P.IVA: {inst.vat_number}</span>
            </li>
          ))}
          {installers.length === 0 && <p className="text-gray-500">Nessun installatore inserito.</p>}
        </ul>
      </div>
    </div>
  );
}
