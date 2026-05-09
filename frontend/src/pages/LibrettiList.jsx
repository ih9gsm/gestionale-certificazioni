import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import LibrettoPdf from '../components/LibrettoPdf';

export default function LibrettiList() {
  const [libretti, setLibretti] = useState([]);

  useEffect(() => {
    const fetchLibretti = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/libretti');
        setLibretti(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLibretti();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Libretti di Impianto (DPR 74/2013)</h1>
        <Link to="/libretti/new" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-semibold">
          + Nuovo Libretto
        </Link>
      </div>

      <div className="bg-white p-4 rounded shadow border-t-4 border-green-500">
        {libretti.length === 0 ? (
          <p className="text-gray-500">Nessun libretto presente nel sistema.</p>
        ) : (
          <ul>
            {libretti.map(libretto => (
              <li key={libretto.id} className="border-b py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">Libretto #{libretto.id} - {libretto.tipo_impianto.replace('_', ' ').toUpperCase()}</h3>
                    <p><strong>Responsabile Impianto:</strong> {libretto.client_name}</p>
                    <p><strong>Manutentore:</strong> {libretto.installer_company}</p>
                    <p><strong>Indirizzo Impianto:</strong> {libretto.indirizzo_impianto}</p>
                    {libretto.tipo_generatore && <p className="text-sm text-gray-600 mt-1"><em>Generatore: {libretto.tipo_generatore} - Matr: {libretto.matricola_generatore} - {libretto.potenza_termica} kW</em></p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm text-gray-500">
                      Compilato: {new Date(libretto.data_compilazione).toLocaleDateString()}
                    </div>
                    <PDFDownloadLink
                      document={<LibrettoPdf libretto={libretto} />}
                      fileName={`Libretto_${libretto.id}_${(libretto.client_name || 'Sconosciuto').replace(' ', '_')}.pdf`}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm font-semibold"
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
