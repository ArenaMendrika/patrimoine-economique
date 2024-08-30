import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Patrimoine from '../../models/Patrimoine.js';
import Possession from '../../models/possessions/Possession.js';

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

  if (isNaN(parsedDateDebut) || isNaN(parsedDateFin)) {
    return res.status(400).json({ message: 'Dates invalides' });
  }

  try {
    const data = await loadData();
    const patrimoineData = data.find(entry => entry.model === 'Patrimoine');

    if (patrimoineData) {
      const possessions = patrimoineData.data.possessions.map(p => 
        new Possession(
          p.possesseur,
          p.libelle,
          p.valeur,
          new Date(p.dateDebut),
          p.dateFin ? new Date(p.dateFin) : null,
          p.tauxAmortissement
        )
      );

      const patrimoine = new Patrimoine(patrimoineData.data.possesseur, possessions);

      const valuePatrimoines = [];
      let currentDate = new Date(parsedDateDebut);

      while (currentDate <= parsedDateFin) {
        valuePatrimoines.push(patrimoine.getValeur(currentDate));
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

  if (isNaN(parsedDate)) {
    return res.status(400).json({ message: 'Date invalide' });
  }

  try {
    const data = await loadData();
    const patrimoineData = data.find(entry => entry.model === 'Patrimoine');

    if (patrimoineData) {
      const possessions = patrimoineData.data.possessions.map(p => 
        new Possession(
          p.possesseur,
          p.libelle,
          p.valeur,
          new Date(p.dateDebut),
          p.dateFin ? new Date(p.dateFin) : null,
          p.tauxAmortissement
        )
      );

      const patrimoine = new Patrimoine(patrimoineData.data.possesseur, possessions);

      const totalValeur = patrimoine.getValeur(parsedDate);
      res.json({ valeur: totalValeur });
    } else {
      res.status(404).json({ message: 'Patrimoine non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
