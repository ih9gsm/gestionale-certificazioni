import { Routes, Route, Link } from 'react-router-dom';
import Clients from './pages/Clients';
import Installers from './pages/Installers';
import DicoList from './pages/DicoList';
import DicoForm from './pages/DicoForm';
import Settings from './pages/Settings';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 relative">
      <nav className="bg-blue-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between font-semibold">
          <div className="flex gap-4">
            <Link to="/" className="hover:text-blue-300">Home</Link>
            <Link to="/clients" className="hover:text-blue-300">Clienti</Link>
            <Link to="/installers" className="hover:text-blue-300">Installatori</Link>
            <Link to="/dicos" className="hover:text-blue-300">DICO DM 37/08</Link>
          </div>
          <div>
            <Link to="/settings" className="hover:text-blue-300">Impostazioni</Link>
          </div>
        </div>
      </nav>

      <main className="p-4">
        <Routes>
          <Route path="/" element={
            <div className="container mx-auto">
              <h1 className="text-2xl font-bold mb-4">Gestione Certificazioni - mr.dico Clone</h1>
              <p>Benvenuto. Usa il menu in alto per gestire l'anagrafica e compilare le Dichiarazioni di Conformità.</p>
            </div>
          } />
          <Route path="/clients" element={<Clients />} />
          <Route path="/installers" element={<Installers />} />
          <Route path="/dicos" element={<DicoList />} />
          <Route path="/dico/new" element={<DicoForm />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      <ChatWidget />
    </div>
  );
}

export default App;
