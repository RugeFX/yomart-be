import express, { json, type Application } from "express";
import cors from "cors";

// Middlewares
import jwtAuth from "./middleware/jwtAuth";

// Route Imports
import itemsRoute from "./routes/items";
import usersRoute from "./routes/users";
import authRoute from "./routes/auth";
import reviewsRoute from "./routes/reviews";

const app: Application = express();
const PORT: number = 3000;

app.use(json());
app.use(cors());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/items", itemsRoute);
app.use("/api/users", jwtAuth, usersRoute);
app.use("/api/reviews", reviewsRoute);

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
