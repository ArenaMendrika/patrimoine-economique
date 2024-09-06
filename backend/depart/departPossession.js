import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Patrimoine from "../../models/Patrimoine.js";
import Personne from "../../models/Personne.js";
import Possession from "../../models/possessions/Possession.js";
import Flux from "../../models/possessions/Flux.js";

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

const saveData = async (data) => {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
        return { status: "OK" };
    } catch (error) {
        return { status: "ERROR", error };
    }
};

export const getPossessions = async (req, res) => {
    try {
        const result = await loadData();
        const personneData = result.find(item => item.model === "Personne").data;
        const personne = new Personne(personneData.nom);
        const patrimoineData = result.find(item => item.model === "Patrimoine");

        if (patrimoineData) {
            const possessionsInstances = patrimoineData.data.possessions.map(possessionData => {
                if (possessionData.jour) {
                    return new Flux(
                        personne,
                        possessionData.libelle,
                        possessionData.valeurConstante,
                        new Date(possessionData.dateDebut),
                        possessionData.dateFin ? new Date(possessionData.dateFin) : null,
                        possessionData.tauxAmortissement,
                        possessionData.jour
                    );
                }
                return new Possession(
                    personne,
                    possessionData.libelle,
                    possessionData.valeur,
                    new Date(possessionData.dateDebut),
                    possessionData.dateFin ? new Date(possessionData.dateFin) : null,
                    possessionData.tauxAmortissement
                );
            });

            possessionsInstances.forEach(possession => {
                possession.valeurActuelle = possession.getValeur(new Date()).toFixed(2);
            });

            res.json(possessionsInstances);
        } else {
            res.status(404).json({ message: "Patrimoine non trouvé" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPossession = async (req, res) => {
    try {
        const result = await loadData();
        const personneData = result.find(item => item.model === "Personne").data;
        const personne = new Personne(personneData.nom);
        const patrimoineData = result.find(item => item.model === "Patrimoine");

        if (patrimoineData) {
            const possessions = patrimoineData.data.possessions.map(possessionData => {
                if (possessionData.jour) {
                    return new Flux(
                        personne,
                        possessionData.libelle,
                        possessionData.valeurConstante,
                        new Date(possessionData.dateDebut),
                        possessionData.dateFin ? new Date(possessionData.dateFin) : null,
                        possessionData.tauxAmortissement,
                        possessionData.jour
                    );
                }
                return new Possession(
                    personne,
                    possessionData.libelle,
                    possessionData.valeur,
                    new Date(possessionData.dateDebut),
                    possessionData.dateFin ? new Date(possessionData.dateFin) : null,
                    possessionData.tauxAmortissement
                );
            });

            const patrimoine = new Patrimoine(personne, possessions);
            const { possesseur, libelle, valeurConstante, dateDebut, dateFin, tauxAmortissement, jour, valeur } = req.body;

            const newPossession = jour ? 
                new Flux(possesseur, libelle, valeurConstante, new Date(dateDebut), dateFin ? new Date(dateFin) : null, tauxAmortissement, jour) :
                new Possession(possesseur, libelle, valeur, new Date(dateDebut), dateFin ? new Date(dateFin) : null, tauxAmortissement);

            patrimoine.addPossession(newPossession);

            result.forEach((entry, index) => {
                if (entry.model === "Patrimoine") {
                    result[index] = {
                        ...entry,
                        data: {
                            ...entry.data,
                            possessions: patrimoine.possessions
                        }
                    };
                }
            });

            const writeResult = await saveData(result);
            if (writeResult.status === "OK") {
                res.status(201).json(newPossession);
            } else {
                res.status(500).json(writeResult.error);
            }
        } else {
            res.status(404).json({ message: "Patrimoine non trouvé" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePossession = async (req, res) => {
    const { libelle } = req.params;
    const { dateFin, newLibelle } = req.body;

    try {
        const result = await loadData();
        const personneData = result.find(item => item.model === "Personne").data;
        const personne = new Personne(personneData.nom);
        const patrimoineData = result.find(item => item.model === "Patrimoine");

        if (patrimoineData) {
            const possessions = patrimoineData.data.possessions.map(possessionData => {
                return possessionData.jour ?
                    new Flux(
                        personne,
                        possessionData.libelle,
                        possessionData.valeurConstante,
                        new Date(possessionData.dateDebut),
                        possessionData.dateFin ? new Date(possessionData.dateFin) : null,
                        possessionData.tauxAmortissement,
                        possessionData.jour
                    ) :
                    new Possession(
                        personne,
                        possessionData.libelle,
                        possessionData.valeur,
                        new Date(possessionData.dateDebut),
                        possessionData.dateFin ? new Date(possessionData.dateFin) : null,
                        possessionData.tauxAmortissement
                    );
            });

            const patrimoine = new Patrimoine(personne, possessions);
            const possession = possessions.find(p => p.libelle === libelle);

            if (possession) {
                if (newLibelle) possession.libelle = newLibelle;
                if (dateFin) possession.dateFin = dateFin;

                result.forEach((item, index) => {
                    if (item.model === "Patrimoine") {
                        result[index] = {
                            ...item,
                            data: {
                                ...item.data,
                                possessions: item.data.possessions.map(poss => poss.libelle === libelle ? {
                                    ...poss,
                                    libelle: newLibelle || poss.libelle,
                                    dateFin: dateFin ? new Date(dateFin).toISOString() : poss.dateFin
                                } : poss)
                            }
                        };
                    }
                });

                const writeResult = await saveData(result);
                if (writeResult.status === "OK") {
                    res.json(possession);
                } else {
                    res.status(500).json(writeResult.error);
                }
            } else {
                res.status(404).json({ message: "Possession non trouvée" });
            }
        } else {
            res.status(404).json({ message: "Patrimoine non trouvé" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const closePossession = async (req, res) => {
    const { libelle } = req.params;

    try {
        const result = await loadData();
        const patrimoineData = result.find(item => item.model === "Patrimoine");

        if (patrimoineData) {
            const possessions = patrimoineData.data.possessions;
            const possession = possessions.find(p => p.libelle === libelle);

            if (possession) {
                possession.dateFin = new Date().toISOString();

                const writeResult = await saveData(result);
                if (writeResult.status === "OK") {
                    res.json(possession);
                } else {
                    res.status(500).json(writeResult.error);
                }
            } else {
                res.status(404).json({ message: "Possession non trouvée" });
            }
        } else {
            res.status(404).json({ message: "Patrimoine non trouvé" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};