import express from "express";
import cors from "cors";

// Route Imports
import itemsRoute from "./routes/items";
import usersRoute from "./routes/users";
import authRoute from "./routes/auth";
import jwtAuth from "./middleware/jwtAuth";

const app: express.Application = express();
const PORT: number = 3000;

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/items", jwtAuth, itemsRoute);
app.use("/api/users", jwtAuth, usersRoute);
app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
