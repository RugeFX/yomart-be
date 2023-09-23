import express, { json, type Application } from "express";
import cors from "cors";
import registerRoutes from "./routes";

// Initialize application
const app: Application = express();
const PORT: number = 3000;

// Register middlewares
app.use(json());
app.use(cors());

// Register routes
registerRoutes(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
