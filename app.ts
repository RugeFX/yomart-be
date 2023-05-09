import express from "express";
import cors from "cors";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

// Middlewares
import jwtAuth from "./middleware/jwtAuth";

// Route Imports
import itemsRoute from "./routes/items";
import usersRoute from "./routes/users";
import authRoute from "./routes/auth";
import reviewsRoute from "./routes/reviews";

const app: express.Application = express();
const PORT: number = 3000;

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/items", jwtAuth, itemsRoute);
app.use("/api/users", jwtAuth, usersRoute);
app.use("/api/reviews", jwtAuth, reviewsRoute);

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
