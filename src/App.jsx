import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayouts from "./layouts/MainLayouts";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import Chat from "./pages/Chat";
import Perguntas from "./pages/Perguntas";
import Quiz from "./pages/Quiz";
import Perfil from "./pages/Perfil";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayouts />}>
          <Route index element={<Login />} />
          <Route path="inicio" element={<Inicio />} />
          <Route path="chat" element={<Chat />} />
          <Route path="perguntas" element={<Perguntas />} />
          <Route path="perguntas/quizz/:tema" element={<Quiz />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
