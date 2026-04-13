import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated } from "./services/api";
import MainLayouts from "./layouts/MainLayouts";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import Chat from "./pages/Chat";
import Perguntas from "./pages/Perguntas";
import Quiz from "./pages/Quiz";
import Perfil from "./pages/Perfil";
import RedefSenha from "./pages/RedefSenha";

function RotaProtegida({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayouts />}>
          <Route index element={<Login />} />
          <Route path="login/redefinirSenha" element={<RedefSenha />} />

          <Route path="inicio" element={<RotaProtegida><Inicio /></RotaProtegida>} />
          <Route path="chat" element={<RotaProtegida><Chat /></RotaProtegida>} />
          <Route path="perguntas" element={<RotaProtegida><Perguntas /></RotaProtegida>} />
          <Route path="perguntas/quizz/:tema" element={<RotaProtegida><Quiz /></RotaProtegida>} />
          <Route path="perfil" element={<RotaProtegida><Perfil /></RotaProtegida>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
