import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function DicoList() {
  const [dicos, setDicos] = useState([]);

  useEffect(() => {
    const fetchDicos = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/dicos');
        setDicos(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDicos();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Elenco Dichiarazioni di Conformità</h1>
        <Link to="/dico/new" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-semibold">
          + Nuova DICO
        </Link>
      </div>

      <div className="bg-white p-4 rounded shadow">
        {dicos.length === 0 ? (
          <p className="text-gray-500">Nessuna DICO presente nel sistema.</p>
        ) : (
          <ul>
            {dicos.map(dico => (
              <li key={dico.id} className="border-b py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">DICO #{dico.id} - {dico.tipo_intervento.replace('_', ' ').toUpperCase()}</h3>
                    <p><strong>Cliente:</strong> {dico.client_name}</p>
                    <p><strong>Installatore:</strong> {dico.installer_company}</p>
                    <p><strong>Indirizzo Impianto:</strong> {dico.indirizzo_impianto}</p>
                    <p className="text-sm text-gray-600 mt-1"><em>{dico.descrizione_impianto}</em></p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(dico.created_at).toLocaleDateString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
