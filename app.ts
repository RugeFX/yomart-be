import express from "express";
import { config } from "dotenv";
config();

// Route Imports
import itemsRoute from "./routes/items";
import usersRoute from "./routes/users";

const app: express.Application = express();
const PORT: number = 3000;

app.use(express.json());

// Routes
app.use("/api/items", itemsRoute);
app.use("/api/users", usersRoute);

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
