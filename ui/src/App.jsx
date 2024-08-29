import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Flux from '../../models/possessions/Flux';
import Possession from '../../models/possessions/Possession';
import Patrimoine from '../../models/Patrimoine';
import Personne from '../../models/Personne';
<link rel="stylesheet" href="index.css" />

const formatNumber = (number) => {
  return new Intl.NumberFormat('fr-FR').format(number);
};

const PossessionsTable = ({ possessions }) => {
  return (
    <div className='table-responsive' style={{marginTop: '5%'}}>
      <table className='table table-striped table-bordered' style={{ width: '80%', margin: '0 auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
        <thead>
          <tr>
            <th style={{color: 'white', background: '#004ca1'}}>Libellé</th>
            <th style={{color: 'white', background: '#004ca1'}}>Valeur</th>
            <th style={{color: 'white', background: '#004ca1'}}>Date de Début</th>
            <th style={{color: 'white', background: '#004ca1'}}>Date de Fin</th>
            <th style={{color: 'white', background: '#004ca1'}}>Amortissement</th>
            <th style={{color: 'white', background: '#004ca1'}}>Valeur Actuelle</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map((possession, index) => (
            <tr key={index}>
              <td>{possession.libelle}</td>
              <td>{formatNumber(possession.valeur)} Ar</td>
              <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
              <td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : 'N/A'}</td>
              <td>{possession.tauxAmortissement || 'N/A'}</td>
              <td>{formatNumber(possession.getValeur(new Date()).toFixed(2))} Ar</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PatrimoineCalculator = ({ patrimoine }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [valeurPatrimoine, setValeurPatrimoine] = useState(null);

  const calculerValeurPatrimoine = () => {
    const valeur = patrimoine.getValeur(selectedDate);
    setValeurPatrimoine(valeur.toFixed(2));
  };

  return (
    <div className="mt-4">
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy"
      />
      <button 
        onClick={calculerValeurPatrimoine} 
      >
          Valider
      </button>
      {valeurPatrimoine !== null && 
        <p className='fs-2 mt-3'>Valeur du Patrimoine : {formatNumber(valeurPatrimoine) + ' Ar'}</p>}
    </div>
  );
};

const App = () => {
  const [patrimoine, setPatrimoine] = useState(null);

  useEffect(() => {
    fetch('/data.json')
      .then((res) => res.json())
      .then((data) => {
        const personneData = data.find(item => item.model === 'Personne').data;
        const possessionsData = data.find(item => item.model === 'Patrimoine').data.possessions;

        const personne = new Personne(personneData.nom);
        const possessions = possessionsData.map((item) => {
          if (item.jour) {
            return new Flux(
              personne,
              item.libelle,
              item.valeurConstante,
              new Date(item.dateDebut),
              item.dateFin ? new Date(item.dateFin) : null,
              item.tauxAmortissement,
              item.jour
            );
          } else {
            return new Possession(
              personne,
              item.libelle,
              item.valeur,
              new Date(item.dateDebut),
              item.dateFin ? new Date(item.dateFin) : null,
              item.tauxAmortissement
            );
          }
        });

        const patrimoineInstance = new Patrimoine(personne, possessions);
        setPatrimoine(patrimoineInstance);
      });
  }, []);

  if (!patrimoine) {
    return <div>Chargement en cours...</div>;
  }

  return (
    <div className='vh-100 d-flex flex-column justify-content-center align-items-center'>
      <div className='container text-center'>
        <h1 className='mb-4'>Voyez l'évolution du patrimoine de {patrimoine.possesseur.nom}</h1>
        <PossessionsTable possessions={patrimoine.possessions} />
        <PatrimoineCalculator patrimoine={patrimoine} />
      </div>
    </div>
  );
};

export default App;
