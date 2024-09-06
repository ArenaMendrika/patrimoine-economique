import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompleterPossessionPage from "../components/CompleterPossessionPage";

import { backendApiUrl } from '../../config';

const CreatePossessionPage = () => {
  const [formData, setFormData] = useState({
    libelle: "",
    valeur: "",
    dateDebut: "",
    tauxAmortissement: ""
  });
  const [newPossession, setNewPossession] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${backendApiUrl}/possession`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    setNewPossession(data.valeur);
    navigate("/possession");
  };

  return (
    <CompleterPossessionPage
      {...formData}
      onLibelleChange={handleChange}
      onValeurChange={handleChange}
      onDateDebutChange={handleChange}
      onTauxChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};

export default CreatePossessionPage;
