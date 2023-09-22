import { NextFunction, Request, Response } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role === "USER")
    return res.status(403).send({
      status: "failed",
      data: "You are forbidden to do this action.",
    });

  next();
};
