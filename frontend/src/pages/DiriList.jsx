import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DiriPdf from '../components/DiriPdf';

export default function DiriList() {
  const [diris, setDiris] = useState([]);

  useEffect(() => {
    const fetchDiris = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/diris');
        setDiris(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDiris();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Elenco Dichiarazioni di Rispondenza (DIRI)</h1>
        <Link to="/diri/new" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 font-semibold">
          + Nuova DIRI
        </Link>
      </div>

      <div className="bg-white p-4 rounded shadow border-t-4 border-yellow-500">
        {diris.length === 0 ? (
          <p className="text-gray-500">Nessuna DIRI presente nel sistema.</p>
        ) : (
          <ul>
            {diris.map(diri => (
              <li key={diri.id} className="border-b py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">DIRI #{diri.id} - Impianto {diri.impianto_tipo.toUpperCase()}</h3>
                    <p><strong>Cliente:</strong> {diri.client_name}</p>
                    <p><strong>Tecnico:</strong> {diri.installer_company}</p>
                    <p><strong>Indirizzo Impianto:</strong> {diri.indirizzo_impianto}</p>
                    <p><strong>Anno Presunto:</strong> {diri.anno_realizzazione}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm text-gray-500">
                      {new Date(diri.created_at).toLocaleDateString()}
                    </div>
                    <PDFDownloadLink
                      document={<DiriPdf diri={diri} />}
                      fileName={`DIRI_${diri.id}_${(diri.client_name || 'Sconosciuto').replace(' ', '_')}.pdf`}
                      className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 text-sm font-semibold"
                    >
                      {({ loading }) => (loading ? 'Generazione PDF...' : 'Scarica PDF')}
                    </PDFDownloadLink>
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
