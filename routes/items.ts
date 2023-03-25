import { Router } from "express";
import Item from "../types/Item";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const router: Router = Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const items: Item[] = await prisma.item.findMany();
    if (items.length < 1) {
      res.status(404).send({ data: "No data" });
      return;
    }
    res.send({ data: items });
  } catch (e) {
    res.status(500).send({ data: e });
  }
});

router.post("/", async (req, res) => {
  const { name, stock }: Item = req.body;
  try {
    const query: Item = await prisma.item.create({
      data: {
        name,
        stock,
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
    const id: number = parseInt(req.params.id);
    const item = await prisma.item.findFirst({ where: { id } });
    if (item == null) {
      res.status(404).send({ data: "No data" });
      return;
    }
    res.send({ data: item });
  } catch (e) {
    res.status(500).send({ data: e });
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
    res.send({ data: query });
  } catch (e) {
    res.status(500).send({ data: e });
  }
});

export default router;
