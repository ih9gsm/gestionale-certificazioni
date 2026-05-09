import { Routes, Route, Link } from 'react-router-dom';
import Clients from './pages/Clients';
import Installers from './pages/Installers';
import Materials from './pages/Materials';
import DicoList from './pages/DicoList';
import DicoForm from './pages/DicoForm';
import DiriList from './pages/DiriList';
import DiriForm from './pages/DiriForm';
import LibrettiList from './pages/LibrettiList';
import LibrettiForm from './pages/LibrettiForm';
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
            <Link to="/materials" className="hover:text-blue-300">Materiali</Link>
            <Link to="/dicos" className="hover:text-blue-300 border-l border-blue-600 pl-4">DICO</Link>
            <Link to="/diris" className="hover:text-blue-300 text-yellow-300">DIRI</Link>
            <Link to="/libretti" className="hover:text-blue-300 text-green-300 border-l border-blue-600 pl-4">Libretti Impianto</Link>
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
              <p>Benvenuto. Usa il menu in alto per gestire l'anagrafica, i materiali, e compilare le Dichiarazioni (DICO e DIRI) e i Libretti di Impianto.</p>
            </div>
          } />
          <Route path="/clients" element={<Clients />} />
          <Route path="/installers" element={<Installers />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/dicos" element={<DicoList />} />
          <Route path="/dico/new" element={<DicoForm />} />
          <Route path="/diris" element={<DiriList />} />
          <Route path="/diri/new" element={<DiriForm />} />
          <Route path="/libretti" element={<LibrettiList />} />
          <Route path="/libretti/new" element={<LibrettiForm />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      <ChatWidget />
    </div>
  );
}

export default App;
