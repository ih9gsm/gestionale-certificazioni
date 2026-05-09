const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      vat_number TEXT
    )`, (err) => {
      if (err) console.error("Error creating clients table", err);
    });

    db.run(`CREATE TABLE IF NOT EXISTS installers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      responsible_person TEXT NOT NULL,
      vat_number TEXT NOT NULL,
      address TEXT NOT NULL
    )`, (err) => {
      if (err) console.error("Error creating installers table", err);
    });

    db.run(`CREATE TABLE IF NOT EXISTS dicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER,
      installer_id INTEGER,
      tipo_intervento TEXT NOT NULL,
      descrizione_impianto TEXT NOT NULL,
      indirizzo_impianto TEXT NOT NULL,
      impianto_tipo TEXT NOT NULL,
      norme_tecniche TEXT,
      allegato_progetto BOOLEAN DEFAULT 0,
      allegato_relazione_materiali BOOLEAN DEFAULT 0,
      allegato_schema_impianto BOOLEAN DEFAULT 0,
      allegato_certificato_requisiti BOOLEAN DEFAULT 0,
      relazione_materiali_testo TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id),
      FOREIGN KEY (installer_id) REFERENCES installers(id)
    )`, (err) => {
      if (err) console.error("Error creating dicos table", err);
    });

    db.run(`CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      setting_key TEXT UNIQUE NOT NULL,
      setting_value TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error("Error creating settings table", err);
      } else {
        db.run(`INSERT OR IGNORE INTO settings (setting_key, setting_value) VALUES ('ai_agent_enabled', 'true')`);
      }
    });

    db.run(`CREATE TABLE IF NOT EXISTS materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT,
      name TEXT NOT NULL,
      description TEXT
    )`, (err) => {
      if (err) console.error("Error creating materials table", err);
    });

    db.run(`CREATE TABLE IF NOT EXISTS diris (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER,
      installer_id INTEGER,
      impianto_tipo TEXT NOT NULL,
      descrizione_impianto TEXT NOT NULL,
      indirizzo_impianto TEXT NOT NULL,
      anno_realizzazione TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id),
      FOREIGN KEY (installer_id) REFERENCES installers(id)
    )`, (err) => {
      if (err) console.error("Error creating diris table", err);
    });
  }
});

module.exports = db;
