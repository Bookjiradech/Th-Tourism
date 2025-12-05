import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { router } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// CORS - อนุญาต frontend
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));

app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.json({ 
    message: "TH-TOURISM API", 
    version: "1.0.0",
    port: env.PORT 
  });
});

// API routes
app.use("/api", router);

// Error handler กลาง
app.use(errorHandler);

export default app;
