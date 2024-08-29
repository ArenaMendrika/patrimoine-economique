import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UpdatePossessionForm from "../CompleterUpdatePossession";

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
