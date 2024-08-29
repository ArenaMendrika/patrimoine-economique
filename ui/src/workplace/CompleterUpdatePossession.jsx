import React from 'react';

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

export default UpdatePossessionForm;
