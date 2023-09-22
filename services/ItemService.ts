import { PrismaClient, Item } from "@prisma/client";
import { validateItem } from "../validation";

type NewItem = Pick<Item, "name" | "stock" | "seller_id">;

class ItemService {
  public client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
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
