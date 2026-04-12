import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayouts from "./layouts/MainLayouts";
import Login from "./pages/Login";
import ConfiguracaoEstudo from "./pages/ConfiguracaoEstudo";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayouts />}>
          <Route index element={<Login />} />
          <Route path="configuracao" element={<ConfiguracaoEstudo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
