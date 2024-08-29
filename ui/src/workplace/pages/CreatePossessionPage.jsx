import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


function PossessionForm({ libelle, valeur, dateDebut, tauxAmortissement, onLibelleChange, onValeurChange, onDateDebutChange, onTauxChange, onSubmit }) {
    return (
      <div className="container">
        <h2>Créer une Possession</h2>
        <form onSubmit={onSubmit}>
          <div className="m-3">
            <label>Libellé</label>
            <input type="text" value={libelle} onChange={onLibelleChange} className="form-control" />
          </div>
          <div className="m-3">
            <label>Valeur</label>
            <input type="number" value={valeur} onChange={onValeurChange} className="form-control" />
          </div>
          <div className="m-3">
            <label>Date Début</label>
            <input type="date" value={dateDebut} onChange={onDateDebutChange} className="form-control" />
          </div>
          <div className="m-3">
            <label>Taux</label>
            <input type="number" value={tauxAmortissement} onChange={onTauxChange} className="form-control" />
          </div>
          <button type="submit" className="btn btn-secondary">
            Créer
          </button>
        </form>
      </div>
    );
  }

  function CreatePossessionPage() {
    const [libelle, setLibelle] = useState("");
    const [newPossession, setNewPossession] = useState({})
    const [valeur, setValeur] = useState("");
    const [dateDebut, setDateDebut] = useState("");
    const [tauxAmortissement, setTauxAmortissement] = useState("");
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      // Envoyer les données au backend
      const response = await fetch("http://localhost:3000/possession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ libelle, valeur, dateDebut, tauxAmortissement }),
      });
      const data = await response.json();
      setNewPossession(data.valeur)
      navigate("/possession");
    };
  
    return (
      <PossessionForm
        libelle={libelle}
        valeur={valeur}
        dateDebut={dateDebut}
        tauxAmortissement={tauxAmortissement}
        onLibelleChange={(e) => setLibelle(e.target.value)}
        onValeurChange={(e) => setValeur(e.target.value)}
        onDateDebutChange={(e) => setDateDebut(e.target.value)}
        onTauxChange={(e) => setTauxAmortissement(e.target.value)}
        onSubmit={handleSubmit}
      />
    );
  }
  
  export default CreatePossessionPage;
  