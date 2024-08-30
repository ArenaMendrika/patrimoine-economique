import  express from "express";
const router = express.Router();
import { getPossessions, createPossession, updatePossession, closePossession } from "../depart/departPossession.js";

router.get("/", getPossessions)

router.post("/", createPossession);

router.patch("/:libelle", updatePossession);

router.post("/:libelle/close", closePossession);

export default router;