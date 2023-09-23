import { Router } from "express";
import { Prisma, Item } from "@prisma/client";
import { ZodError } from "zod";
import ItemService from "../services/ItemService";
import jwtAuth from "../middleware/jwtAuth";
import { handlePrismaClientError } from "../utils/errorHandler";
import dbClient from "../config/dbClient";

const router: Router = Router();
const itemService = new ItemService(dbClient);

router.get("/", async (req, res) => {
  try {
    const items: Item[] = await itemService.getAll();

    if (items.length < 1) return res.status(404).send({ status: "failed", data: "No data" });

    return res.send({ status: "success", data: items });
  } catch (e) {
    return res.status(500).send({ status: "failed", data: e });
  }
});

router.post("/", jwtAuth, async (req, res) => {
  try {
    const { name, stock }: Item = req.body;
    const { id: userId, role } = req.user;

    if (role === "USER")
      return res.status(403).send({
        status: "failed",
        data: "You are forbidden to do this action.",
      });

    const newItem: Item = await itemService.create({
      name,
      stock,
      seller_id: userId,
    });

    return res.send({ status: "success", data: newItem });
  } catch (e) {
    if (e instanceof ZodError) return res.status(400).send({ status: "failed", data: e.issues });

    if (e instanceof Prisma.PrismaClientValidationError)
      return res.status(400).send({ status: "failed", data: e.message });

    console.error(e);
    return res.status(500).send({ status: "failed", data: e });
  }
});

router.put("/:id", jwtAuth, async (req, res) => {
  const id: number = Number(req.params.id);
  const { name, stock }: Item = req.body;

  try {
    const item = await itemService.getById(id);

    const { id: userId, role } = req.user;
    if (item && (item.seller_id === userId || role === "ADMIN")) {
      const updatedItem = await itemService.updateById({
        id,
        name,
        stock,
      });
      return res.send({ status: "success", data: updatedItem });
    }

    return res.status(403).send({ status: "failed", data: "You're not the owner of this record." });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      const error = handlePrismaClientError(e);
      return res.status(error.statusCode).send(error.response);
    }

    return res.status(500).send({ status: "failed", data: e });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const item = await itemService.getById(id);

    if (item == null) return res.status(404).send({ status: "failed", data: "No data" });

    return res.send({ status: "success", data: item });
  } catch (e) {
    return res.status(500).send({ status: "failed", data: e });
  }
});

router.delete("/:id", jwtAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { id: userId, role } = req.user;

  try {
    const item = await itemService.getById(id);

    if (item && (item.seller_id === userId || role === "ADMIN")) {
      const deletedItem = await itemService.deleteById(id);
      return res.send({ status: "success", data: deletedItem });
    }

    return res.status(403).send({ status: "failed", data: "You're not the owner of this record." });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      const error = handlePrismaClientError(e);
      return res.status(error.statusCode).send(error.response);
    }

    return res.status(500).send({ status: "failed", data: e });
  }
});

export default router;
