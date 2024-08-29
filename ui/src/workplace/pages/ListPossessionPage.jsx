import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import './css/style.css'
import { useNavigate } from 'react-router-dom';


function PossessionList({ possessions, refetchPossessions }) {

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
      <Link to="/possession/create" className="btn-custom">
        Ajouter une nouvelle possession
      </Link>
      <div className="table-responsive">
      <table className="table table-striped table-bordered table-hover mt-3">
        <thead>
          <tr>
            <th className="text-center">Libellé</th>
            <th className="text-center">Valeur Initiale</th>
            <th className="text-center">Date Début</th>
            <th className="text-center">Date Fin</th>
            <th className="text-center">Taux</th>
            <th className="text-center">Valeur Actuelle</th>
            <th className="text-center">Action</th>
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
                  ? possession.tauxAmortissement+" %"
                  : "_"}
              </td>
              <td className="text-center">{possession.valeurActuelle}</td>
              <td className="text-center">
                <Link
                  to={`/possession/${possession.libelle}/update`}
                  className="btn btn-secondary"
                >
                  Editer
                </Link>
                <button className="btn btn-danger ms-2"
                  onClick={() => closePossession(possession.libelle)}
                >
                  Clôturer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}


function PossessionListPage() {
    const [possessions, setPossessions] = useState([]);
  
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/possession", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setPossessions(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
  
  
    useEffect(() => {
  
      fetchData();
    }, []);
  
    return <PossessionList possessions={possessions} refetchPossessions={fetchData}/>;
  }
  
  export default PossessionListPage;