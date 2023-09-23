import { type User, type Item, type Review, type CartItem, Role } from "@prisma/client";
import { z } from "zod";

type NewUser = Pick<User, "username" | "password" | "role">;
type LoginUser = Pick<User, "username" | "password">;
type NewItem = Pick<Item, "name" | "stock">;
type NewReview = Pick<Review, "item_id" | "rating" | "body">;
type NewCartItem = Pick<CartItem, "item_id" | "cart_id">;

export const validateUser = (user: NewUser) => {
  const Schema = z.object({
    username: z.string().min(6),
    password: z.string().min(12),
    role: z.nativeEnum(Role),
  });

  return Schema.parse(user);
};

export const validateLogin = (user: LoginUser) => {
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

export const validateReview = (review: NewReview) => {
  const Schema = z.object({
    item_id: z.number(),
    rating: z.number().gte(0).lte(5),
    body: z.string().min(10).max(150),
  });

  return Schema.parse(review);
};

export const validateCartItem = (item: NewCartItem) => {
  const Schema = z.object({
    cart_id: z.number(),
    item_id: z.number(),
  });

  return Schema.parse(item);
};
