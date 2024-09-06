import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Patrimoine from '../../models/Patrimoine.js';
import Possession from '../../models/possessions/Possession.js';
import Flux from '../../models/possessions/Flux.js'; 
import Personne from '../../models/Personne.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.resolve(__dirname, '../../data/data.json');

const loadData = async () => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error('Erreur de lecture du fichier de données');
  }
};

export const getValeurPatrimoineRange = async (req, res) => {
  const { type, dateDebut, dateFin, jour } = req.body;

  const parsedDateDebut = new Date(dateDebut);
  const parsedDateFin = new Date(dateFin);

  if (isNaN(parsedDateDebut.getTime()) || isNaN(parsedDateFin.getTime())) {
    return res.status(400).json({ message: 'Dates invalides' });
  }

  try {
    const data = await loadData();
    const personneData = data.find((entry) => entry.model === 'Personne')?.data;
    if (!personneData) {
      return res.status(404).json({ message: 'Personne non trouvée' });
    }
    
    const personne = new Personne(personneData.nom);

    const patrimoineData = data.find((entry) => entry.model === 'Patrimoine');
    if (patrimoineData) {
      const possessions = patrimoineData.data.possessions.map((p) => {
        if (p.jour) {
          return new Flux(
            personne,
            p.libelle,
            p.valeurConstante,
            new Date(p.dateDebut),
            p.dateFin ? new Date(p.dateFin) : null,
            p.tauxAmortissement,
            p.jour
          );
        }
        return new Possession(
          personne,
          p.libelle,
          p.valeur,
          new Date(p.dateDebut),
          p.dateFin ? new Date(p.dateFin) : null,
          p.tauxAmortissement
        );
      });

      const patrimoine = new Patrimoine(personne, possessions);

      const valuePatrimoines = [];
      let currentDate = new Date(parsedDateDebut);
      while (currentDate <= parsedDateFin) {
        const valeurActuelle = patrimoine.getValeur(currentDate);
        valuePatrimoines.push(valeurActuelle);
        currentDate.setDate(currentDate.getDate() + jour);
      }

      res.json({ valeur: valuePatrimoines });
    } else {
      res.status(404).json({ message: 'Patrimoine non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getValeurPatrimoine = async (req, res) => {
  const { date } = req.params;
  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ message: 'Date invalide' });
  }

  try {
    const data = await loadData();
    const personneData = data.find((entry) => entry.model === 'Personne')?.data;
    if (!personneData) {
      return res.status(404).json({ message: 'Personne non trouvée' });
    }
    
    const personne = new Personne(personneData.nom);

    const patrimoineData = data.find((entry) => entry.model === 'Patrimoine');
    if (patrimoineData) {
      const possessions = patrimoineData.data.possessions.map((p) => {
        if (p.jour) {
          return new Flux(
            personne,
            p.libelle,
            p.valeurConstante,
            new Date(p.dateDebut),
            p.dateFin ? new Date(p.dateFin) : null,
            p.tauxAmortissement,
            p.jour
          );
        }
        return new Possession(
          personne,
          p.libelle,
          p.valeur,
          new Date(p.dateDebut),
          p.dateFin ? new Date(p.dateFin) : null,
          p.tauxAmortissement
        );
      });

      const patrimoine = new Patrimoine(personne, possessions);

      const totalValeur = patrimoine.getValeur(parsedDate);
      res.json({ valeur: totalValeur });
    } else {
      res.status(404).json({ message: 'Patrimoine non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};