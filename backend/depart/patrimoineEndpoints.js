import { readFile } from '../../data/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import Patrimoine from '../../models/Patrimoine.js';
import Possession from '../../models/possessions/Possession.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '../../data/data.json');

const getPatrimoine = async () => {
  const result = await readFile(dataFilePath);
  if (result.status === 'OK') {
    const patrimoineData = result.data.find(entry => entry.model === 'Patrimoine');
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
      return new Patrimoine(patrimoineData.data.possesseur, possessions);
    }
  }
  return null;
};

export const getValeurPatrimoineRange = async (req, res) => {
  const { type, dateDebut, dateFin, jour } = req.body;

  const parsedDateDebut = new Date(dateDebut);
  const parsedDateFin = new Date(dateFin);

  if (isNaN(parsedDateDebut.getTime()) || isNaN(parsedDateFin.getTime())) {
    return res.status(400).json({ message: 'Dates invalides' });
  }

  const patrimoine = await getPatrimoine();
  if (patrimoine) {
    let valuePatrimoines = [];
    for (let currentDate = new Date(parsedDateDebut); currentDate <= parsedDateFin; currentDate.setDate(currentDate.getDate() + jour)) {
      valuePatrimoines.push(patrimoine.getValeur(currentDate));
    }
    res.json({ valeur: valuePatrimoines });
  } else {
    res.status(404).json({ message: 'Patrimoine non trouvé' });
  }
};

export const getValeurPatrimoine = async (req, res) => {
  const { date } = req.params;
  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ message: 'Date invalide' });
  }

  const patrimoine = await getPatrimoine();
  if (patrimoine) {
    res.json({ valeur: patrimoine.getValeur(parsedDate) });
  } else {
    res.status(404).json({ message: 'Patrimoine non trouvé' });
  }
};
