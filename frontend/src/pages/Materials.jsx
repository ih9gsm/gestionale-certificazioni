import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({ code: '', name: '', description: '' });

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/materials');
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/materials', formData);
      setFormData({ code: '', name: '', description: '' });
      fetchMaterials();
    } catch (err) {
      console.error(err);
      alert('Error creating material');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Anagrafica Materiali</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Aggiungi Materiale</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input className="border p-2 rounded" type="text" name="code" placeholder="Codice Articolo (opzionale)" value={formData.code} onChange={handleChange} />
          <input className="border p-2 rounded" type="text" name="name" placeholder="Nome Materiale (es. Cavo FG16)" value={formData.name} onChange={handleChange} required />
          <textarea className="border p-2 rounded" name="description" placeholder="Descrizione o specifiche tecniche" value={formData.description} onChange={handleChange} rows="2"></textarea>
          <button type="submit" className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700">Salva Materiale</button>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Elenco Materiali</h2>
        <ul>
          {materials.map(mat => (
            <li key={mat.id} className="border-b py-2 flex justify-between items-center">
              <div>
                <span className="font-semibold">{mat.name}</span> {mat.code && <span className="text-gray-500 text-sm ml-2">({mat.code})</span>}
                {mat.description && <p className="text-sm text-gray-600">{mat.description}</p>}
              </div>
            </li>
          ))}
          {materials.length === 0 && <p className="text-gray-500">Nessun materiale in anagrafica.</p>}
        </ul>
      </div>
    </div>
  );
}
