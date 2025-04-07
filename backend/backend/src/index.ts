import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import protectedRoutes from "./routes/protected.routes";
import shiftRoutes from "./routes/shift.routes";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(protectedRoutes);
app.use(shiftRoutes);


app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});
