import { z } from "zod";

const colorHexRegex = /^#([A-Fa-f0-9]{6})$/;

export const projectCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  client: z.string().trim().max(120).nullable().optional(),
  colorHex: z.string().regex(colorHexRegex).optional()
});

export const projectUpdateSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    client: z.string().trim().max(120).nullable().optional(),
    colorHex: z.string().regex(colorHexRegex).optional(),
    archived: z.boolean().optional()
  })
  .refine((value) => Object.keys(value).length > 0, "At least one field must be provided");

export const taskNamesQuerySchema = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional()
});

export const dateQuerySchema = z.object({
  date: z.string().optional()
});

export const startTimerSchema = z.object({
  taskName: z.string().trim().min(1).max(200),
  projectId: z.string().cuid().nullable().optional(),
  startedAt: z.string().datetime().optional()
});

export const stopTimerSchema = z.object({
  id: z.string().cuid().optional(),
  endedAt: z.string().datetime().optional()
});

export const patchTimeEntrySchema = z
  .object({
    taskName: z.string().trim().min(1).max(200).optional(),
    projectId: z.string().cuid().nullable().optional(),
    duration: z.string().regex(/^(\d{1,3}):(\d{2})$/).optional()
  })
  .refine((value) => Object.keys(value).length > 0, "At least one field must be provided");

export const reportQuerySchema = z.object({
  range: z.enum(["day", "week", "month"]).default("day"),
  date: z.string().optional()
});
