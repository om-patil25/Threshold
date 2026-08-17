import z from "zod";

export const tokenValidation = z.object({
  token: z.string(),
});
