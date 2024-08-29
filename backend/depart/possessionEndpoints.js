import { readFile, writeFile } from '../../data/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import Patrimoine from '../../models/Patrimoine.js';
import Personne from '../../models/Personne.js';
import Possession from '../../models/possessions/Possession.js';
import Flux from '../../models/possessions/Flux.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '../../data/data.json');

const getPersonneAndPatrimoine = async () => {
  const result = await readFile(dataFilePath);
  if (result.status !== 'OK') throw new Error(result.error);

  const personneData = result.data.find(item => item.model === 'Personne').data;
  const patrimoineData = result.data.find(item => item.model === 'Patrimoine');
  if (!patrimoineData) throw new Error('Patrimoine non trouvé');

  const personne = new Personne(personneData.nom);
  const possessions = patrimoineData.data.possessions.map(p => {
    return p.jour ? new Flux(
      personne,
      p.libelle,
      p.valeurConstante,
      new Date(p.dateDebut),
      p.dateFin ? new Date(p.dateFin) : null,
      p.tauxAmortissement,
      p.jour
    ) : new Possession(
      personne,
      p.libelle,
      p.valeur,
      new Date(p.dateDebut),
      p.dateFin ? new Date(p.dateFin) : null,
      p.tauxAmortissement
    );
  });

  return new Patrimoine(personne, possessions);
};

export const getPossessions = async (req, res) => {
  try {
    const patrimoine = await getPersonneAndPatrimoine();
    patrimoine.possessions.forEach(p => p.valeurActuelle = p.getValeur(new Date()).toFixed(2));
    res.json(patrimoine.possessions);
  } catch (error) {
    res.status(error.message === 'Patrimoine non trouvé' ? 404 : 500).json({ message: error.message });
  }
};

export const createPossession = async (req, res) => {
  try {
    const patrimoine = await getPersonneAndPatrimoine();
    const possessionBody = req.body;
    const newPossession = possessionBody.jour ? new Flux(
      possessionBody.possesseur,
      possessionBody.libelle,
      possessionBody.valeurConstante,
      new Date(possessionBody.dateDebut),
      possessionBody.dateFin ? new Date(possessionBody.dateFin) : null,
      possessionBody.tauxAmortissement,
      possessionBody.jour
    ) : new Possession(
      possessionBody.possesseur,
      possessionBody.libelle,
      possessionBody.valeur,
      new Date(possessionBody.dateDebut),
      possessionBody.dateFin ? new Date(possessionBody.dateFin) : null,
      possessionBody.tauxAmortissement
    );

    patrimoine.addPossession(newPossession);

    const updatedData = result.data.map(entry =>
      entry.model === 'Patrimoine' ? {
        ...entry,
        data: { ...entry.data, possessions: patrimoine.possessions }
      } : entry
    );

    const writeResult = await writeFile(dataFilePath, updatedData);
    if (writeResult.status === 'OK') {
      res.status(201).json(newPossession);
    } else {
      res.status(500).json(writeResult.error);
    }
  } catch (error) {
    res.status(error.message === 'Patrimoine non trouvé' ? 404 : 500).json({ message: error.message });
  }
};

export const updatePossession = async (req, res) => {
  const { libelle } = req.params;
  const { dateFin, newLibelle } = req.body;

  try {
    const patrimoine = await getPersonneAndPatrimoine();
    const possession = patrimoine.possessions.find(p => p.libelle === libelle);

    if (possession) {
      if (newLibelle) possession.libelle = newLibelle;
      if (dateFin) possession.dateFin = new Date(dateFin).toISOString();

      const updatedData = result.data.map(item => {
        if (item.model === 'Patrimoine') {
          return {
            ...item,
            data: {
              ...item.data,
              possessions: item.data.possessions.map(p =>
                p.libelle === libelle ? {
                  ...p,
                  libelle: newLibelle || p.libelle,
                  dateFin: dateFin ? new Date(dateFin).toISOString() : p.dateFin
                } : p
              )
            }
          };
        }
        return item;
      });

      const writeResult = await writeFile(dataFilePath, updatedData);
      if (writeResult.status === 'OK') {
        res.json(possession);
      } else {
        res.status(500).json(writeResult.error);
      }
    } else {
      res.status(404).json({ message: 'Possession non trouvée' });
    }
  } catch (error) {
    res.status(error.message === 'Patrimoine non trouvé' ? 404 : 500).json({ message: error.message });
  }
};

export const closePossession = async (req, res) => {
  const { libelle } = req.params;

  try {
    const patrimoine = await getPersonneAndPatrimoine();
    const possession = patrimoine.possessions.find(p => p.libelle === libelle);

    if (possession) {
      possession.dateFin = new Date().toISOString();

      const updatedData = result.data.map(item => {
        if (item.model === 'Patrimoine') {
          return {
            ...item,
            data: {
              ...item.data,
              possessions: item.data.possessions.map(p =>
                p.libelle === libelle ? { ...p, dateFin: possession.dateFin } : p
              )
            }
          };
        }
        return item;
      });

      const writeResult = await writeFile(dataFilePath, updatedData);
      if (writeResult.status === 'OK') {
        res.json(possession);
      } else {
        res.status(500).json(writeResult.error);
      }
    } else {
      res.status(404).json({ message: 'Possession non trouvée' });
    }
  } catch (error) {
    res.status(error.message === 'Patrimoine non trouvé' ? 404 : 500).json({ message: error.message });
  }
};
