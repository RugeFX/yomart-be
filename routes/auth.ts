import "dotenv/config";
import { PrismaClient, Prisma, type User as UserP, Role } from "@prisma/client";
import { Router } from "express";
import { ZodError } from "zod";
import { JsonWebTokenError, sign, verify } from "jsonwebtoken";
import { validateLogin, validateUser } from "../validation";
import { comparePassword, cryptPassword } from "../utils/password";
import jwtAuth from "../middleware/jwtAuth";
import type DecodedToken from "../types/DecodedToken";

const router = Router();
const prisma = new PrismaClient();

router.post("/login", async (req, res) => {
  const { username, password }: UserP = req.body;

  try {
    validateLogin({
      username,
      password,
    });

    const user = await prisma.user.findFirst({ where: { username } });
    if (!user) return res.status(404).send({ status: "failed", data: "No user found" });

    if (!(await comparePassword(password, user.password)))
      return res.status(400).send({ status: "failed", data: "Password is incorrect!" });

    const token = createAccessToken(user.id, user.role);
    const refreshToken = sign({ id: user.id }, process.env.REFRESH_SECRET!, {
      expiresIn: "1d",
    });

    const tomorrow = new Date(Date.now() + 1);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await prisma.refreshToken.create({
      data: { token: refreshToken, expires_at: tomorrow },
    });

    return res.send({
      status: "success",
      data: { access: token, refresh: refreshToken },
    });
  } catch (e) {
    console.error(e);
    if (e instanceof ZodError) return res.status(400).send({ status: "failed", data: e.issues });

    return res.status(500).send({ status: "failed", data: e });
  }
});

router.post("/token", async (req, res) => {
  try {
    const token = req.body.refreshToken;
    if (!token) return res.status(401).send({ status: "failed", data: "No token provided" });

    const findToken = await prisma.refreshToken.findFirst({ where: { token } });
    if (!findToken) return res.status(403).send({ status: "failed", data: "Invalid token" });

    const decoded = verify(token, process.env.REFRESH_SECRET!) as DecodedToken;
    const accessToken = createAccessToken(decoded.id, decoded.role);

    return res.status(200).send({ status: "success", data: accessToken });
  } catch (e) {
    console.error(e);
    if (e instanceof JsonWebTokenError)
      return res.status(403).send({ status: "failed", data: "Token error", error: e.message });

    return res.status(500).send({ status: "failed", data: e });
  }
});

router.post("/register", async (req, res) => {
  const { username, password }: UserP = req.body;
  const role = "USER";
  const created_at = new Date();
  const updated_at = new Date();

  try {
    validateUser({
      username,
      password,
      role,
    });

    const createdUser = await prisma.user.create({
      data: {
        username,
        password: await cryptPassword(password),
        role,
        cart: { create: { items: undefined } },
        created_at,
        updated_at,
      },
    });

    const token = createAccessToken(createdUser.id, createdUser.role);

    return res.send({ status: "success", data: token });
  } catch (e) {
    console.error(e);
    if (e instanceof ZodError) return res.status(400).send({ status: "failed", data: e.issues });

    return res.status(500).send({ status: "failed", data: e });
  }
});

router.delete("/logout", jwtAuth, async (req, res) => {
  try {
    const token: string | null = req.body.refreshToken;
    if (!token) return res.status(401).send({ status: "failed", data: "No token provided" });

    await prisma.refreshToken.delete({
      where: { token },
    });
    return res.status(200).send({ status: "success", data: "Successfully logged out" });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError)
      return res.status(400).send({ status: "failed", data: e.meta?.cause });

    console.error(e);
    return res.status(500).send({ status: "failed", data: e });
  }
});

function createAccessToken(id: string, role: Role) {
  return sign({ id, role }, process.env.TOKEN_SECRET!, {
    expiresIn: "15s",
  });
}

export default router;
