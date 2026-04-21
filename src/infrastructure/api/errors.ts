import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "@/shared/errors/AppError";
import { fail } from "@/infrastructure/api/response";

export function toErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return fail(error.statusCode, error.code, error.message, error.details);
  }

  if (error instanceof SyntaxError) {
    return fail(400, "INVALID_JSON", "Malformed JSON body");
  }

  if (error instanceof ZodError) {
    return fail(400, "VALIDATION_ERROR", "Invalid request data", error.flatten());
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return fail(409, "CONFLICT", "Resource already exists", error.meta);
    }
    if (error.code === "P2025") {
      return fail(404, "NOT_FOUND", "Resource not found", error.meta);
    }
    return fail(400, "DATABASE_ERROR", "Database operation failed", error.meta);
  }

  console.error(error);
  return fail(500, "INTERNAL_SERVER_ERROR", "Unexpected server error");
}
