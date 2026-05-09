import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DicoForm() {
  const [clients, setClients] = useState([]);
  const [installers, setInstallers] = useState([]);
  const [formData, setFormData] = useState({
    client_id: '',
    installer_id: '',
    tipo_intervento: 'nuovo_impianto',
    descrizione_impianto: '',
    indirizzo_impianto: '',
    allegato_progetto: false,
    allegato_relazione_materiali: false,
    allegato_schema_impianto: false,
    allegato_certificato_requisiti: false,
    relazione_materiali_testo: ''
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
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/dicos', formData);
      navigate('/dicos');
    } catch (err) {
      console.error(err);
      alert('Error creating DICO');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Compilazione DICO DM 37/08</h1>

      <div className="bg-white p-6 rounded shadow">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label className="block font-semibold mb-1">Impresa Installatrice</label>
            <select name="installer_id" value={formData.installer_id} onChange={handleChange} className="w-full border p-2 rounded" required>
              <option value="">-- Seleziona Installatore --</option>
              {installers.map(i => <option key={i.id} value={i.id}>{i.company_name} (Resp. {i.responsible_person})</option>)}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Committente / Cliente</label>
            <select name="client_id" value={formData.client_id} onChange={handleChange} className="w-full border p-2 rounded" required>
              <option value="">-- Seleziona Cliente --</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Tipo di Intervento</label>
            <select name="tipo_intervento" value={formData.tipo_intervento} onChange={handleChange} className="w-full border p-2 rounded" required>
              <option value="nuovo_impianto">Nuovo Impianto</option>
              <option value="trasformazione">Trasformazione</option>
              <option value="ampliamento">Ampliamento</option>
              <option value="manutenzione_straordinaria">Manutenzione Straordinaria</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Descrizione dell'impianto</label>
            <textarea name="descrizione_impianto" value={formData.descrizione_impianto} onChange={handleChange} className="w-full border p-2 rounded" rows="3" required placeholder="Es. Impianto termico autonomo a gas..."></textarea>
          </div>

          <div>
            <label className="block font-semibold mb-1">Indirizzo dell'impianto</label>
            <input type="text" name="indirizzo_impianto" value={formData.indirizzo_impianto} onChange={handleChange} className="w-full border p-2 rounded" required placeholder="Via, Città, Prov..." />
          </div>

          <div className="border-t pt-4 mt-2">
            <h3 className="font-semibold mb-2">Allegati Obbligatori</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="allegato_progetto" checked={formData.allegato_progetto} onChange={handleChange} />
                Progetto (art. 5 DM 37/08)
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="allegato_relazione_materiali" checked={formData.allegato_relazione_materiali} onChange={handleChange} />
                Relazione tipologica dei materiali utilizzati
              </label>

              {formData.allegato_relazione_materiali && (
                <textarea
                  name="relazione_materiali_testo"
                  value={formData.relazione_materiali_testo}
                  onChange={handleChange}
                  className="w-full border p-2 rounded ml-6 mt-1"
                  rows="3"
                  placeholder="Elenco materiali: Tubazioni Rame, Cavi FG16, etc..."
                />
              )}

              <label className="flex items-center gap-2">
                <input type="checkbox" name="allegato_schema_impianto" checked={formData.allegato_schema_impianto} onChange={handleChange} />
                Schema di impianto realizzato
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="allegato_certificato_requisiti" checked={formData.allegato_certificato_requisiti} onChange={handleChange} />
                Copia del certificato di riconoscimento dei requisiti tecnico-professionali
              </label>
            </div>
          </div>

          <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mt-4">
            Genera DICO
          </button>
        </form>
      </div>
    </div>
  );
}
