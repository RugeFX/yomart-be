import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, verify } from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({ data: "No token provided" });

    const token = authHeader.split(" ")[1];

    verify(token, process.env.TOKEN_SECRET as string);
    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError)
      return res.status(403).send({ data: "Token error", error: err.message });

    return res
      .status(500)
      .send({ data: "Failed to authenticate user", error: err });
  }
};
