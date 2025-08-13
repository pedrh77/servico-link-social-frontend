import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Home from './pages/Home/Home';
import LoginPage from './pages/Login/Login';
import RegisterPage from './pages/Cadastro/Register';
import EtapaEscolha from './pages/Doacao/EtapaEscolha';
import EtapaValores from "./pages/Doacao/EtapaValores";
import Usuario from "./pages/Usuario/Usuario";
import EtapaFinalizacao from "./pages/Doacao/EtapaFinalizacao";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/etapa" element={<EtapaEscolha />} />
        <Route path="/valores" element={<EtapaValores />} />
        <Route path="/Final" element={<EtapaFinalizacao />} />
        <Route path="/Usuario" element={<Usuario />} />

        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter >

  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
