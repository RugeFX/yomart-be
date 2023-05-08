import { Router } from "express";
import Item from "../types/Item";
import { Prisma, PrismaClient } from "@prisma/client";
import { validateItem } from "../validation";
import { ZodError } from "zod";

const router: Router = Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const items: Item[] = await prisma.item.findMany();
    if (items.length < 1) {
      res.status(404).send({ status: "failed", data: "No data" });
      return;
    }
    res.send({ status: "success", data: items });
  } catch (e) {
    res.status(500).send({ status: "failed", data: e });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, stock }: Item = req.body;
    validateItem({ name, stock });

    const newItem: Item = await prisma.item.create({
      data: {
        name,
        stock,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    res.send({ status: "success", data: newItem });
  } catch (e) {
    if (e instanceof ZodError)
      return res.status(400).send({ status: "failed", data: e.issues });

    res.status(500).send({ status: "failed", data: e });
    console.error(e);
  }
});

router.put("/:id", async (req, res) => {
  const id: number = parseInt(req.params.id);
  const { name, stock }: Item = req.body;
  const updated_at: Date = new Date();

  try {
    const updatedItem = await prisma.item.update({
      where: {
        id,
      },
      data: {
        name,
        stock,
        updated_at,
      },
    });
    res.send({ status: "success", data: updatedItem });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025")
        return res
          .status(500)
          .send({ status: "failed", data: "Data with given id not found" });

      return res.status(500).send({ status: "failed", data: e.meta?.cause });
    }

    return res.status(500).send({ status: "failed", data: e });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id: number = parseInt(req.params.id);
    const item = await prisma.item.findFirst({ where: { id } });
    if (item == null)
      return res.status(404).send({ status: "failed", data: "No data" });

    res.send({ status: "success", data: item });
  } catch (e) {
    res.status(500).send({ status: "failed", data: e });
  }
});

router.delete("/:id", async (req, res) => {
  const id: number = parseInt(req.params.id);
  try {
    const query = await prisma.item.delete({
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
