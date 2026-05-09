import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({ name: '', address: '', vat_number: '' });

  const fetchClients = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/clients');
      setClients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/clients', formData);
      setFormData({ name: '', address: '', vat_number: '' });
      fetchClients();
    } catch (err) {
      console.error(err);
      alert('Error creating client');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestione Clienti</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Aggiungi Cliente</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input className="border p-2 rounded" type="text" name="name" placeholder="Nome/Ragione Sociale" value={formData.name} onChange={handleChange} required />
          <input className="border p-2 rounded" type="text" name="address" placeholder="Indirizzo Completo" value={formData.address} onChange={handleChange} required />
          <input className="border p-2 rounded" type="text" name="vat_number" placeholder="Partita IVA / Codice Fiscale" value={formData.vat_number} onChange={handleChange} />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Salva Cliente</button>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Elenco Clienti</h2>
        <ul>
          {clients.map(client => (
            <li key={client.id} className="border-b py-2">
              <span className="font-semibold">{client.name}</span> - {client.address} {client.vat_number && `(P.IVA: ${client.vat_number})`}
            </li>
          ))}
          {clients.length === 0 && <p className="text-gray-500">Nessun cliente inserito.</p>}
        </ul>
      </div>
    </div>
  );
}
