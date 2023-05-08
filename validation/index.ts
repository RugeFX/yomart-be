import { User, Item } from "@prisma/client";
import { z } from "zod";

type NewUser = Pick<User, "username" | "password">;
type NewItem = Pick<Item, "name" | "stock">;

export const validateUser = (user: NewUser) => {
  const Schema = z.object({
    username: z.string().min(6),
    password: z.string().min(12),
  });

  return Schema.parse(user);
};

export const validateItem = (item: NewItem) => {
  const Schema = z.object({
    name: z.string().min(4),
    stock: z.number().gte(0),
  });

  return Schema.parse(item);
};

// export const validateLogin = (user: NewUser) => {
//   const Schema = z.object({
//     username: z.string().min(6),
//     password: z.string().min(12),
//   });

//   return Schema.parse(user);
// };
