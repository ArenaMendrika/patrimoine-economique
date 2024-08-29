import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePossessionForm = ({ libelle, dateFin, setDateFin, newLibelle, setNewLibelle, handleSubmit }) => {
  return (
    <div className="container">
      <h2>Mettre à jour la Possession: {libelle}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nouveau nom de libelle</label>
          <input 
            type="text" 
            value={newLibelle} 
            onChange={(e) => setNewLibelle(e.target.value)} 
            className="form-control" 
          />
          <label>Date Fin</label>
          <input 
            type="date" 
            value={dateFin} 
            onChange={(e) => setDateFin(e.target.value)} 
            className="form-control" 
          />
        </div>
        <button type="submit" className="btn btn-secondary">
          Mettre à jour
        </button>
      </form>
    </div>
  );
};


const UpdatePossessionPage = () => {
    const { libelle } = useParams();
    const [dateFin, setDateFin] = useState("");
    const navigate = useNavigate();
    const [newLibelle, setNewLibelle] = useState("");
    const [newPossession, setNewPossession] = useState({});
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const response = await fetch(`http://localhost:3000/possession/${libelle}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateFin, newLibelle }),
      });
      const data = await response.json();
      setNewPossession(data.valeur);
      navigate("/possession");
    };
  
    return (
      <UpdatePossessionForm
        libelle={libelle}
        dateFin={dateFin}
        setDateFin={setDateFin}
        newLibelle={newLibelle}
        setNewLibelle={setNewLibelle}
        handleSubmit={handleSubmit}
      />
    );
  };
  
  export default UpdatePossessionPage;