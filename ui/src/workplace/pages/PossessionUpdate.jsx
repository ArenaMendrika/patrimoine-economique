import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CompleterUpdatePossession from "../components/CompleterUpdatePossession"

import { backendApiUrl } from '../components/config';

const PossessionUpdate = () => {
  const { libelle } = useParams();
  const [formData, setFormData] = useState({
    dateFin: "",
    newLibelle: "",
  });
  const navigate = useNavigate();
  const [newPossession, setNewPossession] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${backendApiUrl}/possession/${libelle}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    setNewPossession(data.valeur);
    navigate("/possession");
  };

  return (
    <CompleterUpdatePossession
      libelle={libelle}
      dateFin={formData.dateFin}
      newLibelle={formData.newLibelle}
      onDateFinChange={handleChange}
      onNewLibelleChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};

export default PossessionUpdate;
