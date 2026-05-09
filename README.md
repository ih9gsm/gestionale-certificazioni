# mr.dico Clone - Gestione Certificazioni

Questa applicazione è un clone web-based semplificato del software "mr.dico", sviluppata in Node.js (Express + SQLite) e React (Vite + Tailwind CSS). Permette la gestione dell'anagrafica Clienti e Installatori, e la compilazione del modulo base "Dichiarazione di Conformità" (DICO DM 37/08).

## Struttura del Progetto

Il progetto è diviso in due cartelle principali:
- `backend/`: API REST e Database SQLite.
- `frontend/`: Interfaccia Utente React.

## Come Avviare l'Applicazione

Per far funzionare l'app, è necessario avviare entrambi i server (backend e frontend) in due terminali separati.

### 1. Avviare il Backend

Apri un terminale e vai nella cartella `backend`:

`cd backend`
`npm install`
`npm start`

Il backend si avvierà e sarà in ascolto su `http://localhost:3000`. Verrà creato automaticamente il database SQLite (`database.sqlite`) se non esiste.

### 2. Avviare il Frontend

Apri un **nuovo** terminale, vai nella cartella `frontend`:

`cd frontend`
`npm install`
`npm run dev`

Il server Vite si avvierà e fornirà un link locale (es: `http://localhost:5173/`). Apri questo link nel tuo browser per iniziare a usare l'applicazione.

## Funzionalità Incluse
- **Anagrafica Clienti:** Aggiunta ed elenco.
- **Anagrafica Installatori:** Aggiunta ed elenco imprese/tecnici.
- **Compilazione DICO DM 37/08:** Creazione ed elenco delle Dichiarazioni di Conformità che collegano Clienti e Installatori.
