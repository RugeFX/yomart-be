import { Prisma, PrismaClient, type User } from "@prisma/client";
import { validateUser } from "../validation";

type NewUser = Pick<User, "username" | "password" | "role">;

class UserService {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async getAll(): Promise<User[]> {
    return this.client.user.findMany();
  }

  async getById(id: string): Promise<User | null> {
    return this.client.user.findUnique({ where: { id } });
  }

  async getManyWhere(where: Prisma.UserWhereInput): Promise<User[]> {
    return this.client.user.findMany({ where });
  }

  async getFirstWhere(where: Prisma.UserWhereInput): Promise<User | null> {
    return this.client.user.findFirst({ where });
  }

  async create(user: NewUser): Promise<User> {
    validateUser(user);
    return this.client.user.create({ data: user });
  }

  async updateById(user: Partial<User>): Promise<User> {
    return this.client.user.update({
      data: { ...user, updated_at: new Date() },
      where: { id: user.id },
    });
  }

  async deleteById(id: string): Promise<User> {
    return this.client.user.delete({
      where: { id },
    });
  }
}

export default UserService;
