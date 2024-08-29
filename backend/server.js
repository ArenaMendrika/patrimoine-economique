import express from "express";
import possessionRoutes from './routes/routepossession.js';
import patrimoineRoutes from './routes/routepatrimoine.js';
import cors from "cors";
const port = 3000;
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

app.use(express.json());

app.use("/possession", possessionRoutes);
app.use("/patrimoine", patrimoineRoutes);

app.listen(port, () => {
    console.log("Le serveur a démarré au port " + port)
})