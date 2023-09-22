import { Router } from "express";
import { Prisma, User } from "@prisma/client";
import { ZodError } from "zod";
import { cryptPassword } from "../utils/password";
import UserService from "../services/UserService";

const router: Router = Router();
const userService = new UserService();

router.get("/", async (req, res) => {
  try {
    const users: User[] = await userService.getAll();

    if (users.length < 1)
      return res.status(404).send({ status: "failed", data: null });

    return res.send({ status: "success", data: users });
  } catch (e) {
    return res.status(500).send({ status: "failed", data: e });
  }
});

router.post("/", async (req, res) => {
  const { username, password, role }: User = req.body;

  try {
    const newUser = await userService.create({
      username,
      password: await cryptPassword(password),
      role,
    });

    return res.send({ status: "success", data: newUser });
  } catch (e) {
    if (e instanceof ZodError)
      return res.status(400).send({ status: "failed", data: e.issues });

    console.error(e);
    return res.status(500).send({ status: "failed", data: e });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { username, password }: User = req.body;

  try {
    const updatedUser = await userService.updateById({
      id,
      username,
      password,
    });
    return res.send({ status: "success", data: updatedUser });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025")
        return res
          .status(500)
          .send({ status: "failed", data: "Data with given id not found" });

      return res.status(500).send({ status: "failed", data: e.meta?.cause });
    }
    console.error(e);
    return res.status(500).send({ status: "failed", data: e });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await userService.getById(req.params.id);

    if (user == null)
      return res.status(404).send({ status: "failed", data: "No data" });

    return res.send({ status: "success", data: user });
  } catch (e) {
    return res.status(500).send({ status: "failed", data: e });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await userService.deleteById(req.params.id);

    return res.send({ status: "success", data: deletedUser });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025")
        return res
          .status(404)
          .send({ status: "failed", data: "Record to delete not found" });

      return res.status(500).send({ status: "failed", data: e.meta?.cause });
    }

    return res.status(500).send({ status: "failed", data: e });
  }
});

export default router;
