import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { z } from "zod";

// Type Imports
import User from "../types/User";

const router: Router = Router();
const prisma = new PrismaClient();

const cryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password: string, hashPassword: string) => {
  return await bcrypt.compare(password, hashPassword);
};

router.get("/", async (req, res) => {
  try {
    const users: User[] = await prisma.user.findMany();
    if (users.length < 1) {
      res.status(404).send({ data: "No data" });
      return;
    }
    res.send({ data: users });
  } catch (e) {
    res.status(500).send({ data: e });
  }
});

router.post("/", async (req, res) => {
  const { username, password }: User = req.body;
  try {
    const query: User = await prisma.user.create({
      data: {
        username,
        password: await cryptPassword(password),
      },
    });

    res.send({
      data: query,
    });
  } catch (e) {
    res.status(500).send({ data: e });
    console.error(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id: string = req.params.id;
    const user = await prisma.user.findFirst({ where: { id } });
    if (user == null) {
      res.status(404).send({ data: "No data" });
      return;
    }
    res.send({ data: user });
  } catch (e) {
    res.status(500).send({ data: e });
  }
});

router.delete("/:id", async (req, res) => {
  const id: string = req.params.id;
  try {
    const query = await prisma.user.delete({
      where: {
        id,
      },
    });
    res.send({ data: query });
  } catch (e) {
    res.status(500).send({ data: e });
  }
});

router.post("/check", async (req, res) => {
  const { id, password }: User = req.body;
  try {
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) {
      res.status(404).send({ data: "No user found" });
      return;
    }
    res.send({ data: await comparePassword(password, user.password) });
  } catch (e) {
    res.status(500).send({ data: e });
  }
});

export default router;
