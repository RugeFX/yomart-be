import { Prisma } from "@prisma/client";
import type BaseResponse from "../types/BaseResponse";

export type ErrorWrapper<T> = {
  statusCode: number;
  response: BaseResponse<T>;
};

export function handlePrismaClientError(
  e: Prisma.PrismaClientKnownRequestError
): ErrorWrapper<string> {
  switch (e.code) {
    case "P2025":
      return {
        statusCode: 404,
        response: { status: "failed", data: "Record with given id not found" },
      };
    default:
      return {
        statusCode: 500,
        response: { status: "failed", data: `${e.meta?.cause || "No cause"}` },
      };
  }
}
