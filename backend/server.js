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
    SELECT d.*, c.name as client_name, i.company_name as installer_company
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
  const { client_id, installer_id, tipo_intervento, descrizione_impianto, indirizzo_impianto } = req.body;
  if (!client_id || !installer_id || !tipo_intervento || !descrizione_impianto || !indirizzo_impianto) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.run(`INSERT INTO dicos (client_id, installer_id, tipo_intervento, descrizione_impianto, indirizzo_impianto)
          VALUES (?, ?, ?, ?, ?)`,
    [client_id, installer_id, tipo_intervento, descrizione_impianto, indirizzo_impianto], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, client_id, installer_id, tipo_intervento, descrizione_impianto, indirizzo_impianto });
  });
});


app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
