import { RequestHandler, Response, Router } from "express";
import { Prisma, PrismaClient, Item, Cart, CartItem } from "@prisma/client";
import { validateCartItem } from "../validation";
import { ZodError } from "zod";
import { Request } from "express-serve-static-core";

// const newCartItem: CartItem = await prisma.cartItem.upsert({
//   where: { item_id: Number(itemId) },
//   create: {
//     cart: {
//       connectOrCreate: {
//         where: { user_id: userId },
//         create: { user_id: userId },
//       },
//     },
//     item: { connect: { id: Number(itemId) } },
//     quantity,
//   },
//   update: {
//     quantity,
//   },
// });

const router: Router = Router();
const prisma = new PrismaClient();

router.get("/", getAll);

router.post("/", async (req, res) => {
  try {
    const { itemId, quantity }: { itemId: string; quantity: number } = req.body;
    const {
      user: { id: userId, role },
    } = req;

    const newCartItem: CartItem = await prisma.cartItem.create({
      data: {
        cart: {
          connectOrCreate: {
            where: { user_id: userId },
            create: { user_id: userId },
          },
        },
        item: { connect: { id: Number(itemId) } },
        quantity,
      },
    });

    return res.send({ status: "success", data: newCartItem });
  } catch (e) {
    if (e instanceof ZodError)
      return res.status(400).send({ status: "failed", data: e.issues });

    if (e instanceof Prisma.PrismaClientValidationError)
      return res.status(400).send({ status: "failed", data: e.message });

    console.error(e);
    return res.status(500).send({ status: "failed", data: e });
  }
});

router.put("/:id", async (req, res) => {
  const itemId: number = Number(req.params.id);
  const { quantity }: { quantity: number } = req.body;
  const updated_at: Date = new Date();

  try {
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        item_id: itemId,
      },
      data: {
        quantity,
      },
    });
    return res.send({ status: "success", data: updatedCartItem });
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
    const id = Number(req.params.id);
    const item = await prisma.item.findFirst({
      where: { id },
      include: {
        seller: true,
        reviews: true,
      },
    });
    if (item == null)
      return res.status(404).send({ status: "failed", data: "No data" });

    return res.send({ status: "success", data: item });
  } catch (e) {
    return res.status(500).send({ status: "failed", data: e });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const query = await prisma.item.delete({
      where: {
        id,
      },
    });
    return res.send({ status: "success", data: query });
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

async function getAll(req: Request, res: Response) {
  try {
    const carts: Cart[] = await prisma.cart.findMany({
      include: {
        user: true,
      },
    });
    if (carts.length < 1)
      return res.status(404).send({ status: "failed", data: "No data" });

    return res.send({ status: "success", data: carts });
  } catch (e) {
    return res.status(500).send({ status: "failed", data: e });
  }
}

export default router;
