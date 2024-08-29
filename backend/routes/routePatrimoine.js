import  express from "express";
const router = express.Router();
import { getValeurPatrimoineRange ,getValeurPatrimoine } from "../depart/patrimoineEndpoints.js";

router.post("/range", getValeurPatrimoineRange );

router.get("/:date", getValeurPatrimoine);


export default router;