import { User } from "@prisma/client";
import { z } from "zod";

export const validateUser = (user: Partial<User>) => {
  const Schema = z.object({
    username: z.string().min(6),
    password: z.string().min(12),
    created_at: z.date(),
    updated_at: z.date().default(new Date()),
  });

  return Schema.parse(user);
};

export const validateLogin = (user: Partial<User>) => {
  const Schema = z.object({
    username: z.string().min(6),
    password: z.string().min(12),
  });

  return Schema.parse(user);
};
