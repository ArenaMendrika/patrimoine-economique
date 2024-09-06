import React from "react";

function CompleterPossessionPage({ libelle, valeur, dateDebut, tauxAmortissement, onLibelleChange, onValeurChange, onDateDebutChange, onTauxChange, onSubmit }) {
  return (
    <div className="container">
      <div className="d-flex justify-content-center">
        <form onSubmit={onSubmit} className="p-4 shadow rounded" style={{ maxWidth: '500px', width: '100%', marginTop: '2%' }}>
          <h3 className="text-center mb-4">Allez-y</h3>

          <div className="form-group mb-3">
            <label htmlFor="libelle" className="form-label">Libellé</label>
            <input 
              type="text" 
              id="libelle" 
              value={libelle}
              name="libelle"
              onChange={onLibelleChange} 
              className="form-control form-control-lg"
              placeholder="Entrez le libellé"
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="valeur" className="form-label">Valeur</label>
            <input 
              type="number" 
              id="valeur" 
              name="valeur"
              value={valeur} 
              onChange={onValeurChange} 
              className="form-control form-control-lg"
              placeholder="Entrez la valeur"
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="dateDebut" className="form-label">Date Début</label>
            <input 
              type="date" 
              id="dateDebut"
              name="dateDebut"
              value={dateDebut} 
              onChange={onDateDebutChange} 
              className="form-control form-control-lg"
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="tauxAmortissement" className="form-label">Taux</label>
            <input 
              type="number" 
              id="tauxAmortissement" 
              value={tauxAmortissement} 
              name="tauxAmortissement"
              onChange={onTauxChange} 
              className="form-control form-control-lg"
              placeholder="Entrez le taux d'amortissement"
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn" style={{background: '#d8a62f'}}>
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompleterPossessionPage;
