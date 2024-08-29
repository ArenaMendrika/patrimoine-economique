import React from "react";

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

export default PossessionForm;
