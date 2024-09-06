import React from "react";
import { Link } from "react-router-dom";
import '../styles/style.css'


function ListeDesPossessions({ possessions, refetchPossessions }) {
  const closePossession = async (libelle) => {
    try {
      const response = await fetch(`http://localhost:3000/possession/${libelle}/close`, {
        method: "Post",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      refetchPossessions();
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="display-8" style={{marginTop: '3%'}}>Tout ça c'est à vous ...</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover mt-3">
          <thead>
            <tr>
              <th scope="col" className="text-center">Libellé</th>
              <th scope="col" className="text-center">Valeur Initiale</th>
              <th scope="col" className="text-center">Date Début</th>
              <th scope="col" className="text-center">Date Fin</th>
              <th scope="col" className="text-center">Taux</th>
              <th scope="col" className="text-center">Valeur Actuelle</th>
              <th scope="col" className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {possessions.map((possession, index) => (
              <tr key={index}>
                <td className="text-center">{possession.libelle}</td>
                <td className="text-center">
                  {possession.valeur
                    ? possession.valeur
                    : possession.valeurConstante}
                </td>
                <td className="text-center">
                  {possession.dateDebut
                    ? new Date(possession.dateDebut).toLocaleDateString()
                    : "_"}
                </td>
                <td className="text-center">
                  {possession.dateFin
                    ? new Date(possession.dateFin).toLocaleDateString()
                    : "_"}
                </td>
                <td className="text-center">
                  {possession.tauxAmortissement !== null
                    ? possession.tauxAmortissement + " %"
                    : "_"}
                </td>
                <td className="text-center">{possession.valeurActuelle}</td>
                <td className="text-center">
              <Link
                to={`/possession/${possession.libelle}/update`}
                style={{
                backgroundColor: 'white',
                border: '1px solid #d8a62f',
                color: 'black', 
                textDecoration: 'none', 
                display: 'inline-block',
  }}
                className="btn btn-sm me-2"
              >
            Editer
          </Link>
                  <button
                   style={{
                    backgroundColor: '#d8a62f',
                    color: 'black', 
                    textDecoration: 'none', 
                    display: 'inline-block',
      }}
                    className="btn btn-sm me-2"
                    onClick={() => closePossession(possession.libelle)}
                  >
                    Clôturer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-center">
        <Link
          to="/possession/create"
          style={{
            backgroundColor: '#d8a62f', 
            color: 'black',
            borderRadius: '0.375rem',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            fontWeight: 500,
            transition: 'background-color 0.3s, box-shadow 0.3s',
            textDecoration: 'none',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#c7911b';
            e.target.style.borderColor = '#c7911b';
            e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; 
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#d8a62f'; 
            e.target.style.borderColor = '#d8a62f';
            e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          }}
        >
          Ajouter un Trésor à Votre Liste
        </Link>
      </div>
    </div>
  );
}

export default ListeDesPossessions;