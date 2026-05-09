const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- Clients API ---

app.get('/api/clients', (req, res) => {
  db.all('SELECT * FROM clients', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/clients', (req, res) => {
  const { name, address, vat_number } = req.body;
  if (!name || !address) return res.status(400).json({ error: "Name and address are required" });

  db.run('INSERT INTO clients (name, address, vat_number) VALUES (?, ?, ?)', [name, address, vat_number], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, address, vat_number });
  });
});

// --- Installers API ---

app.get('/api/installers', (req, res) => {
  db.all('SELECT * FROM installers', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/installers', (req, res) => {
  const { company_name, responsible_person, vat_number, address } = req.body;
  if (!company_name || !responsible_person || !vat_number || !address) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.run('INSERT INTO installers (company_name, responsible_person, vat_number, address) VALUES (?, ?, ?, ?)',
    [company_name, responsible_person, vat_number, address], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, company_name, responsible_person, vat_number, address });
  });
});

// --- DICO API ---

app.get('/api/dicos', (req, res) => {
  const query = `
    SELECT d.*, c.name as client_name, i.company_name as installer_company, i.responsible_person as installer_resp
    FROM dicos d
    LEFT JOIN clients c ON d.client_id = c.id
    LEFT JOIN installers i ON d.installer_id = i.id
    ORDER BY d.created_at DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/dicos', (req, res) => {
  const {
    client_id, installer_id, tipo_intervento, descrizione_impianto, indirizzo_impianto, impianto_tipo, norme_tecniche,
    allegato_progetto, allegato_relazione_materiali, allegato_schema_impianto, allegato_certificato_requisiti, relazione_materiali_testo
  } = req.body;

  if (!client_id || !installer_id || !tipo_intervento || !descrizione_impianto || !indirizzo_impianto || !impianto_tipo) {
    return res.status(400).json({ error: "All mandatory fields are required" });
  }

  db.run(`INSERT INTO dicos (
            client_id, installer_id, tipo_intervento, descrizione_impianto, indirizzo_impianto, impianto_tipo, norme_tecniche,
            allegato_progetto, allegato_relazione_materiali, allegato_schema_impianto, allegato_certificato_requisiti, relazione_materiali_testo
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      client_id, installer_id, tipo_intervento, descrizione_impianto, indirizzo_impianto, impianto_tipo, norme_tecniche || '',
      allegato_progetto ? 1 : 0,
      allegato_relazione_materiali ? 1 : 0,
      allegato_schema_impianto ? 1 : 0,
      allegato_certificato_requisiti ? 1 : 0,
      relazione_materiali_testo || ''
    ], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, client_id, installer_id, tipo_intervento, descrizione_impianto, indirizzo_impianto, impianto_tipo });
  });
});


// --- Materials API ---

app.get('/api/materials', (req, res) => {
  db.all('SELECT * FROM materials ORDER BY name ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/materials', (req, res) => {
  const { code, name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  db.run('INSERT INTO materials (code, name, description) VALUES (?, ?, ?)', [code || '', name, description || ''], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, code, name, description });
  });
});

// --- DIRI API ---

app.get('/api/diris', (req, res) => {
  const query = `
    SELECT d.*, c.name as client_name, i.company_name as installer_company, i.responsible_person as installer_resp
    FROM diris d
    LEFT JOIN clients c ON d.client_id = c.id
    LEFT JOIN installers i ON d.installer_id = i.id
    ORDER BY d.created_at DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/diris', (req, res) => {
  const { client_id, installer_id, impianto_tipo, descrizione_impianto, indirizzo_impianto, anno_realizzazione } = req.body;

  if (!client_id || !installer_id || !impianto_tipo || !descrizione_impianto || !indirizzo_impianto) {
    return res.status(400).json({ error: "All mandatory fields are required" });
  }

  db.run(`INSERT INTO diris (client_id, installer_id, impianto_tipo, descrizione_impianto, indirizzo_impianto, anno_realizzazione)
          VALUES (?, ?, ?, ?, ?, ?)`,
    [client_id, installer_id, impianto_tipo, descrizione_impianto, indirizzo_impianto, anno_realizzazione || ''], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, client_id, installer_id, impianto_tipo, descrizione_impianto, indirizzo_impianto, anno_realizzazione });
  });
});

// --- Libretti API (DPR 74/2013) ---

app.get('/api/libretti', (req, res) => {
  const query = `
    SELECT l.*, c.name as client_name, i.company_name as installer_company, i.responsible_person as installer_resp
    FROM libretti l
    LEFT JOIN clients c ON l.client_id = c.id
    LEFT JOIN installers i ON l.installer_id = i.id
    ORDER BY l.created_at DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/libretti', (req, res) => {
  const { client_id, installer_id, tipo_impianto, indirizzo_impianto, tipo_generatore, matricola_generatore, potenza_termica, data_compilazione } = req.body;

  if (!client_id || !installer_id || !tipo_impianto || !indirizzo_impianto || !data_compilazione) {
    return res.status(400).json({ error: "Mandatory fields missing for Libretto" });
  }

  db.run(`INSERT INTO libretti (client_id, installer_id, tipo_impianto, indirizzo_impianto, tipo_generatore, matricola_generatore, potenza_termica, data_compilazione)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [client_id, installer_id, tipo_impianto, indirizzo_impianto, tipo_generatore || '', matricola_generatore || '', potenza_termica || '', data_compilazione], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, client_id, installer_id, tipo_impianto, indirizzo_impianto });
  });
});

// --- Settings API ---

app.get('/api/settings', (req, res) => {
  db.all('SELECT * FROM settings', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const settings = rows.reduce((acc, curr) => {
      acc[curr.setting_key] = curr.setting_value === 'true';
      return acc;
    }, {});
    res.json(settings);
  });
});

app.post('/api/settings', (req, res) => {
  const { ai_agent_enabled } = req.body;
  if (ai_agent_enabled === undefined) return res.status(400).json({ error: "Missing setting value" });

  db.run(`UPDATE settings SET setting_value = ? WHERE setting_key = 'ai_agent_enabled'`, [ai_agent_enabled ? 'true' : 'false'], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- Chat Agent API ---
// In-memory sessions for simplicity
const sessions = {};

const DICO_QUESTIONS = [
  { key: 'client_id', type: 'select', text: 'Per favore, indicami l\'ID del Cliente (es. "1").' },
  { key: 'installer_id', type: 'select', text: 'Perfetto. Ora indicami l\'ID dell\'Installatore (es. "1").' },
  { key: 'impianto_tipo', type: 'select', text: 'Che tipo di impianto è? Scegli tra: elettrico, radiotelevisivo, riscaldamento, idrico, gas, sollevamento, antincendio.' },
  { key: 'tipo_intervento', type: 'text', text: 'Qual è il tipo di intervento? (nuovo_impianto, trasformazione, ampliamento, manutenzione_straordinaria)' },
  { key: 'descrizione_impianto', type: 'text', text: 'Fornisci una breve descrizione dell\'impianto.' },
  { key: 'indirizzo_impianto', type: 'text', text: 'Infine, qual è l\'indirizzo dell\'impianto?' }
];

const NORME_PREDEFINITE = {
  'elettrico': 'CEI 64-8',
  'radiotelevisivo': 'CEI 100-7',
  'riscaldamento': 'UNI 10683, UNI EN 12828',
  'idrico': 'UNI EN 806',
  'gas': 'UNI 7129, UNI 11137',
  'sollevamento': 'UNI EN 81',
  'antincendio': 'UNI 9795'
};

app.post('/api/chat', (req, res) => {
  const { session_id, message } = req.body;
  if (!session_id) return res.status(400).json({ error: "Missing session_id" });

  if (!sessions[session_id]) {
    sessions[session_id] = { step: 0, data: {} };
    return res.json({
      reply: "Ciao! Sono l'assistente virtuale di mr.dico. Vuoi che ti aiuti a compilare una Dichiarazione di Conformità? Rispondi 'si' per iniziare."
    });
  }

  const state = sessions[session_id];

  if (state.step === 0) {
    const lowerMessage = message.toLowerCase();
    const startKeywords = ['si', 'sì', 'crea', 'voglio', 'inizia', 'ok', 'dico', 'certificazione', 'impianto'];

    // Check if the message contains any of the start keywords
    const shouldStart = startKeywords.some(kw => lowerMessage.includes(kw));

    if (shouldStart) {
      state.step = 1;
      return res.json({ reply: DICO_QUESTIONS[0].text });
    } else {
      return res.json({ reply: "Non sono sicuro di aver capito. Se vuoi creare una nuova Dichiarazione di Conformità, rispondi 'sì' oppure scrivi 'crea DICO'." });
    }
  }

  // Record answer for the current question
  const currentQuestion = DICO_QUESTIONS[state.step - 1];

  if (currentQuestion.key === 'client_id' || currentQuestion.key === 'installer_id') {
      const id = parseInt(message.trim());
      if (isNaN(id)) return res.json({ reply: "Per favore inserisci un ID numerico valido." });
      state.data[currentQuestion.key] = id;
  } else {
      state.data[currentQuestion.key] = message;
  }

  state.step++;

  if (state.step <= DICO_QUESTIONS.length) {
    return res.json({ reply: DICO_QUESTIONS[state.step - 1].text });
  } else {
    // Determine default norms based on chosen type
    const tipo = state.data['impianto_tipo'].toLowerCase();
    const norme_tecniche = NORME_PREDEFINITE[tipo] || 'Norme UNI/CEI vigenti';

    // All data collected, save to DB
    const { client_id, installer_id, impianto_tipo, tipo_intervento, descrizione_impianto, indirizzo_impianto } = state.data;

    db.run(`INSERT INTO dicos (client_id, installer_id, impianto_tipo, norme_tecniche, tipo_intervento, descrizione_impianto, indirizzo_impianto)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [client_id, installer_id, impianto_tipo, norme_tecniche, tipo_intervento, descrizione_impianto, indirizzo_impianto], function(err) {

      delete sessions[session_id]; // Reset session

      if (err) {
        return res.json({ reply: "Ho raccolto tutti i dati, ma c'è stato un errore nel salvataggio: " + err.message });
      }
      return res.json({ reply: `Fatto! Ho generato la DICO con ID #${this.lastID}. Puoi trovarla nella lista DICO.` });
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
