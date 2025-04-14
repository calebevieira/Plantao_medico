import express from "express";
import cors from "cors";
import { json } from "body-parser";
import authRoutes from "./routes/auth.routes";
import shiftRoutes from "./routes/shift.routes";
import institutionRoutes from "./routes/institution.routes";

const app = express();

app.use(cors());
app.use(json());

app.use("/auth", authRoutes);
app.use("/shifts", shiftRoutes);
app.use("/institutions", institutionRoutes);
app.use("/shifts", shiftRoutes);


app.listen(3333, () => {
  console.log("🔥 Servidor rodando na porta 3333");
});