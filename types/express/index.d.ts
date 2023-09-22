import { Role } from "@prisma/client";

interface RequestUser {
  id: string;
  role: Role;
}

declare module "express-serve-static-core" {
  interface Request {
    user: RequestUser;
  }
}
