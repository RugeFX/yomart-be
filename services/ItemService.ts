import { PrismaClient, Prisma, type Item } from "@prisma/client";
import { validateItem } from "../validation";

type NewItem = Pick<Item, "name" | "stock" | "seller_id">;

class ItemService {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async getAll(): Promise<Item[]> {
    return this.client.item.findMany({
      include: {
        seller: true,
        reviews: { select: { rating: true } },
      },
    });
  }

  async getById(id: number): Promise<Item | null> {
    return this.client.item.findUnique({
      where: { id },
      include: {
        seller: true,
        reviews: true,
      },
    });
  }

  async getManyWhere(where: Prisma.ItemWhereInput): Promise<Item[]> {
    return this.client.item.findMany({ where });
  }

  async getFirstWhere(where: Prisma.ItemWhereInput): Promise<Item | null> {
    return this.client.item.findFirst({ where });
  }

  async create(item: NewItem): Promise<Item> {
    validateItem(item);
    return this.client.item.create({ data: item });
  }

  async updateById(item: Partial<Item>): Promise<Item> {
    return this.client.item.update({
      data: { ...item, updated_at: new Date() },
      where: { id: item.id },
    });
  }

  async deleteById(id: number): Promise<Item> {
    return this.client.item.delete({
      where: { id },
    });
  }
}

export default ItemService;
