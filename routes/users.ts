import { Router } from "express";
import { PrismaClient, User } from "@prisma/client";
import { ZodError } from "zod";
import { validateUser } from "../validation";
import { cryptPassword } from "../utils/password";

const router: Router = Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const users: User[] = await prisma.user.findMany();
    if (users.length < 1) {
      res.status(404).send({ status: "failed", data: null });
      return;
    }
    res.send({ status: "success", data: users });
  } catch (e) {
    res.status(500).send({ status: "failed", data: e });
  }
});

router.post("/", async (req, res) => {
  const { username, password }: User = req.body;
  const created_at = new Date();
  const updated_at = new Date();

  try {
    validateUser({
      username,
      password,
      created_at,
      updated_at,
    });

    const query = await prisma.user.create({
      data: {
        username,
        password: await cryptPassword(password),
        created_at,
        updated_at,
      },
    });

    res.send({ status: "success", data: query });
  } catch (e) {
    console.error(e);
    if (e instanceof ZodError)
      return res.status(400).send({ status: "failed", data: e.issues });

    return res.status(500).send({ status: "failed", data: e });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id: string = req.params.id;
    const user = await prisma.user.findFirst({ where: { id } });
    if (user == null) {
      res.status(404).send({ status: "failed", data: "No data" });
      return;
    }
    res.send({ status: "success", data: user });
  } catch (e) {
    res.status(500).send({ status: "failed", data: e });
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
    res.send({ status: "success", data: query });
  } catch (e) {
    res.status(500).send({ status: "failed", data: e });
  }
});

export default router;
