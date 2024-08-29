import React from 'react';

const UpdatePossessionForm = ({ libelle, dateFin, setDateFin, newLibelle, setNewLibelle, handleSubmit }) => {
  return (
    <div className="container">
      <div className="d-flex justify-content-center">
  <form onSubmit={handleSubmit} className="p-4 shadow rounded" style={{ maxWidth: '400px', width: '100%', marginTop: '10%' }}>
    <h4 className="text-center mb-4">Mettre à jour le libellé</h4>
    
    <div className="form-group mb-3">
      <label htmlFor="newLibelle" className="form-label">Nouveau nom de libellé</label>
      <input 
        type="text" 
        id="newLibelle" 
        value={newLibelle} 
        onChange={(e) => setNewLibelle(e.target.value)} 
        className="form-control form-control-lg" 
        placeholder="Entrez le nouveau libellé"
      />
    </div>

    <div className="form-group mb-4">
      <label htmlFor="dateFin" className="form-label">Date Fin</label>
      <input 
        type="date" 
        id="dateFin" 
        value={dateFin} 
        onChange={(e) => setDateFin(e.target.value)} 
        className="form-control form-control-lg"
      />
    </div>

    <div className="text-center">
      <button type="submit" className="btn btn-primary btn-lg">
        Mettre à jour
      </button>
    </div>
  </form>
</div>

    </div>
  );
};

export default UpdatePossessionForm;
