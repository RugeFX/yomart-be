import { Application } from "express";
import jwtAuth from "../middleware/jwtAuth";

// Route imports
import itemsRoute from "./items";
import usersRoute from "./users";
import authRoute from "./auth";
import reviewsRoute from "./reviews";

/**
 * Register all routes in the routes folder to the app
 *
 * @param {Application} app - The express application
 * @return {void}
 */
export default function registerRoutes(app: Application): void {
  app.use("/api/auth", authRoute);
  app.use("/api/items", itemsRoute);
  app.use("/api/users", jwtAuth, usersRoute);
  app.use("/api/reviews", reviewsRoute);
}
