import React from 'react';

const CompleterUpdatePossession = ({ libelle, dateFin, newLibelle, onDateFinChange, onNewLibelleChange, onSubmit }) => {
  return (
    <div className="container">
      <div className="d-flex justify-content-center">
        <form onSubmit={onSubmit} className="p-4 shadow rounded" style={{ maxWidth: '400px', width: '100%', marginTop: '10%' }}>
          <h4 className="text-center mb-4">Mettre à jour le libellé</h4>
          
          <div className="form-group mb-3">
            <label htmlFor="newLibelle" className="form-label">Nouveau nom de libellé</label>
            <input 
              type="text" 
              id="newLibelle" 
              name="newLibelle"
              value={newLibelle} 
              onChange={onNewLibelleChange} 
              className="form-control form-control-lg" 
              placeholder="Entrez le nouveau libellé"
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="dateFin" className="form-label">Date Fin</label>
            <input 
              type="date" 
              id="dateFin" 
              name="dateFin"
              value={dateFin} 
              onChange={onDateFinChange} 
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

export default CompleterUpdatePossession;
