import React, { useState, useEffect } from "react";
import ListeDesPossessions from "../ListeDesPossessions";

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

  return <ListeDesPossessions possessions={possessions} refetchPossessions={fetchData}/>;
}

export default PossessionListPage;
