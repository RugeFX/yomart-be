import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, verify } from "jsonwebtoken";
import DecodedToken from "../types/DecodedToken";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res
        .status(401)
        .send({ status: "failed", data: "No token provided" });

    const token = authHeader.split(" ")[1];

    const { id: userId } = verify(
      token,
      process.env.TOKEN_SECRET!
    ) as DecodedToken;

    req.userId = userId;
    next();
  } catch (e) {
    if (e instanceof JsonWebTokenError)
      return res.status(403).send({ status: "failed", data: e.message });

    return res.status(500).send({ status: "failed", data: e });
  }
};
