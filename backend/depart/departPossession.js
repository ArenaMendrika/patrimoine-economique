import { readFile, writeFile } from '../../data/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import Patrimoine from "../../models/Patrimoine.js"
import Personne from "../../models/Personne.js"
import Possession from "../../models/possessions/Possession.js"
import Flux from "../../models/possessions/Flux.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '../../data/data.json');

export const getPossessions = async (req, res) => {
    const result = await readFile(dataFilePath);
    if (result.status === "OK") {
        const personneData = result.data.find(
            (item) => item.model === "Personne"
        ).data;
        const personne = new Personne(personneData.nom);
        const patrimoine = result.data.find((item) => item.model === "Patrimoine");
        if (patrimoine) {
            if (patrimoine) {
                const possessionsInstances = patrimoine.data.possessions.map(
                    (possessionData) => {
                        if (possessionData.jour) {
                            return new Flux(
                                personne,
                                possessionData.libelle,
                                possessionData.valeurConstante,
                                new Date(possessionData.dateDebut),
                                possessionData.dateFin
                                    ? new Date(possessionData.dateFin)
                                    : null,
                                possessionData.tauxAmortissement,
                                possessionData.jour
                            );
                        }
                        return new Possession(
                            personne,
                            possessionData.libelle,
                            possessionData.valeur,
                            new Date(possessionData.dateDebut),
                            possessionData.dateFin
                                ? new Date(possessionData.dateFin)
                                : null,
                            possessionData.tauxAmortissement
                        );
                    })

                for (let i = 0; i < possessionsInstances.length; i++) {
                    possessionsInstances[i].valeurActuelle = possessionsInstances[i].getValeur(new Date()).toFixed(2)
                }

                res.json(possessionsInstances);
            } else {
                res.status(404).json({ message: "Patrimoine non trouvé" });
            }
        }
    } else {
        res.status(500).json(result.error);
    }
};

export const createPossession = async (req, res) => {
    const result = await readFile(dataFilePath);
    if (result.status === "OK") {
        const personneData = result.data.find(
            (item) => item.model === "Personne"
        ).data;
        const personne = new Personne(personneData.nom);
        const patrimoineData = result.data.find(entry => entry.model === "Patrimoine");
        if (patrimoineData) {
            const possessions = patrimoineData.data.possessions.map((possessionData) => {
                if (possessionData.jour) {
                    return new Flux(
                        personne,
                        possessionData.libelle,
                        possessionData.valeurConstante,
                        new Date(possessionData.dateDebut),
                        possessionData.dateFin
                            ? new Date(possessionData.dateFin)
                            : null,
                        possessionData.tauxAmortissement,
                        possessionData.jour
                    );
                }
                return new Possession(
                    personne,
                    possessionData.libelle,
                    possessionData.valeur,
                    new Date(possessionData.dateDebut),
                    possessionData.dateFin
                        ? new Date(possessionData.dateFin)
                        : null,
                    possessionData.tauxAmortissement
                );
            }
            );
            const patrimoine = new Patrimoine(
                personne,
                possessions
            )
            const possessionBody = req.body
            let newPossession
            if (req.body.jour) {
                newPossession = new Flux(
                    possessionBody.possesseur,
                    possessionBody.libelle,
                    possessionBody.valeurConstante,
                    new Date(possessionBody.dateDebut),
                    possessionBody.dateFin ? new Date(possessionBody.dateFin) : null,
                    possessionBody.tauxAmortissement,
                    possessionBody.jour
                )
            } else {
                newPossession = new Possession(
                    possessionBody.possesseur,
                    possessionBody.libelle,
                    possessionBody.valeur,
                    new Date(possessionBody.dateDebut),
                    possessionBody.dateFin ? new Date(possessionBody.dateFin) : null,
                    possessionBody.tauxAmortissement
                );
            }
            patrimoine.addPossession(newPossession);

            result.data = result.data.map(entry =>
                entry.model === "Patrimoine" ? {
                    ...entry,
                    data: { ...entry.data, possessions: patrimoine.possessions }
                } : entry
            );

            const writeResult = await writeFile(dataFilePath, result.data);
            if (writeResult.status === "OK") {
                res.status(201).json(newPossession);
            } else {
                res.status(500).json(writeResult.error);
            }
        } else {
            res.status(404).json({ message: "Patrimoine non trouvé" });
        }
    } else {
        res.status(500).json(result.error);
    }
};

export const updatePossession = async (req, res) => {
    const { libelle } = req.params;
    const { dateFin, newLibelle } = req.body; 
    const result = await readFile(dataFilePath);

    if (result.status === "OK") {
        const personneData = result.data.find(
            (item) => item.model === "Personne"
        ).data;
        const personne = new Personne(personneData.nom);
        const patrimoineData = result.data.find(entry => entry.model === "Patrimoine");
        if (patrimoineData) {
            const possessions = patrimoineData.data.possessions.map((possessionData) => {
                if (possessionData.jour) {
                    return new Flux(
                        personne,
                        possessionData.libelle,
                        possessionData.valeurConstante,
                        new Date(possessionData.dateDebut),
                        possessionData.dateFin
                            ? new Date(possessionData.dateFin)
                            : null,
                        possessionData.tauxAmortissement,
                        possessionData.jour
                    );
                }
                return new Possession(
                    personne,
                    possessionData.libelle,
                    possessionData.valeur,
                    new Date(possessionData.dateDebut),
                    possessionData.dateFin
                        ? new Date(possessionData.dateFin)
                        : null,
                    possessionData.tauxAmortissement
                );
            }
            );

            const patrimoine = new Patrimoine(
                personne,
                possessions
            );

            const possession = possessions.find(p => p.libelle === libelle);

            if (possession) {
                if (newLibelle) possession.libelle = newLibelle;
                if (dateFin) possession.dateFin = dateFin;

                const updatedData = result.data.map(item => {
                    if (item.model === "Patrimoine") {
                        return {
                            ...item,
                            data: {
                                ...item.data,
                                possessions: item.data.possessions.map(poss => {
                                    if (poss.libelle === libelle) {
                                        return {
                                            ...poss,
                                            libelle: newLibelle || poss.libelle,
                                            dateFin: dateFin ? new Date(dateFin).toISOString() : poss.dateFin
                                        };
                                    }
                                    return poss;
                                })
                            }
                        };
                    }
                    return item;
                });

                const writeResult = await writeFile(dataFilePath, updatedData);
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
    } else {
        res.status(500).json(result.error);
    }
};

// Fermer une possession en mettant à jour la dateFin à la date actuelle
export const closePossession = async (req, res) => {
    const { libelle } = req.params;
    const result = await readFile(dataFilePath);

    if (result.status === "OK") {
        const patrimoine = result.data.find(entry => entry.model === "Patrimoine");
        if (patrimoine) {
            const possessions = patrimoine.data.possessions;
            const possession = possessions.find(p => p.libelle === libelle);

            if (possession) {
                possession.dateFin = new Date().toISOString();

                const writeResult = await writeFile(dataFilePath, result.data);
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
    } else {
        res.status(500).json(result.error);
    }
};
