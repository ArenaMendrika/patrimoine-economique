import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import PatrimoinePage from "./workplace/pages/PatrimoinePage";
import PossessionListPage from "./workplace/pages/PossessionListPage";
import CreatePossessionPage from "./workplace/pages/CreationPossession";
import PossessionUpdate from "./workplace/pages/PossessionUpdate";
import Header from "./workplace/pages/Header";
import "./App.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<PatrimoinePage />} />
        <Route path="/patrimoine" element={<PatrimoinePage />} />
        <Route path="/possession" element={<PossessionListPage />} />
        <Route path="/possession/create" element={<CreatePossessionPage />} />
        <Route path="/possession/:libelle/update" element={<PossessionUpdate />}/>
      </Routes>
    </Router>
  );
}

export default App;
