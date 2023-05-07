import { Router } from "express";
import Item from "../types/Item";
import { PrismaClient } from "@prisma/client";

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
  const { name, stock }: Item = req.body;
  try {
    const query: Item = await prisma.item.create({
      data: {
        name,
        stock,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    res.send({ status: "success", data: query });
  } catch (e) {
    res.status(500).send({ status: "failed", data: e });
    console.error(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id: number = parseInt(req.params.id);
    const item = await prisma.item.findFirst({ where: { id } });
    if (item == null) {
      res.status(404).send({ status: "failed", data: "No data" });
      return;
    }
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
