import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, verify } from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res
        .status(401)
        .send({ status: "failed", data: "No token provided" });

    const token = authHeader.split(" ")[1];

    verify(token, process.env.TOKEN_SECRET as string);
    next();
  } catch (e) {
    if (e instanceof JsonWebTokenError)
      return res.status(403).send({ status: "failed", data: e.message });

    return res.status(500).send({ status: "failed", data: e });
  }
};
