import { Prisma, PrismaClient, Review } from "@prisma/client";
import { Router } from "express";
import { ZodError } from "zod";
import { validateReview } from "../validation";

const router: Router = Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const reviews: Review[] = await prisma.review.findMany({
      include: {
        item: true,
        user: true,
      },
    });
    if (reviews.length < 1)
      return res.status(404).send({ status: "failed", data: "No data" });

    res.send({ status: "success", data: reviews });
  } catch (e) {
    res.status(500).send({ status: "failed", data: e });
  }
});

router.post("/", async (req, res) => {
  try {
    const { item_id, rating, body }: Review = req.body;
    const {
      user: { id: userId, role },
    } = req;

    validateReview({ item_id, rating, body });

    const newReview: Review = await prisma.review.create({
      data: {
        user: { connect: { id: userId } },
        item: { connect: { id: item_id } },
        rating,
        body,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    res.send({ status: "success", data: newReview });
  } catch (e) {
    if (e instanceof ZodError)
      return res.status(400).send({ status: "failed", data: e.issues });

    if (e instanceof Prisma.PrismaClientValidationError)
      return res.status(400).send({ status: "failed", data: e.message });

    res.status(500).send({ status: "failed", data: e });
    console.error(e);
  }
});

router.put("/:id", async (req, res) => {
  const id: number = parseInt(req.params.id);
  const { rating, body }: Review = req.body;

  try {
    const updatedReview = await prisma.review.update({
      where: {
        id,
      },
      data: {
        rating,
        body,
        updated_at: new Date(),
      },
    });
    res.send({ status: "success", data: updatedReview });
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
    const id = parseInt(req.params.id);
    const review = await prisma.review.findFirst({
      where: { id },
      include: {
        item: true,
        user: true,
      },
    });
    if (review == null)
      return res.status(404).send({ status: "failed", data: "No data" });

    res.send({ status: "success", data: review });
  } catch (e) {
    res.status(500).send({ status: "failed", data: e });
  }
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deletedReview = await prisma.review.delete({
      where: {
        id,
      },
    });
    res.send({ status: "success", data: deletedReview });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025")
        return res
          .status(404)
          .send({ status: "failed", data: "Record to delete not found" });

      return res.status(500).send({ status: "failed", data: e.meta?.cause });
    }

    res.status(500).send({ status: "failed", data: e });
  }
});

export default router;
