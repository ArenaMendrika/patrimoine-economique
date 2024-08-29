import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import PatrimoinePage from "./workplace/pages/PatrimoinePage";
import PossessionListPage from "./workplace/pages/PossessionListPage";
import CreatePossessionPage from "./workplace/pages/CreationPossession";
import UpdatePossessionPage from "./workplace/pages/PossessionUpdate";
import "./App.css";

function App() {
  return (
    <Router>
      <header className="p-2" style={{ backgroundColor: '#d8a62f' }}>
          <div className="d-flex">
            <div className="d-flex flex-row justify-content-around">
              <Link to="/patrimoine" className="btn"  style={{ fontSize: '1.5rem', color: 'white'}}>
                Patrimoine
              </Link>
              <Link to="/possession" className="btn"  style={{ fontSize: '1.5rem', color: 'white' }}>
                Possession
              </Link>
            </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<PatrimoinePage />} />
        <Route path="/patrimoine" element={<PatrimoinePage />} />
        <Route path="/possession" element={<PossessionListPage />} />
        <Route path="/possession/create" element={<CreatePossessionPage />} />
        <Route
          path="/possession/:libelle/update"
          element={<UpdatePossessionPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
