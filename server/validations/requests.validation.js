import z, { email } from "zod";

export const signupPostRequestBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string().min(8),
  bio: z.string().optional(),
  worktitle: z.string().optional(),
  profileimage: z.string().optional(),
});

export const loginPostRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const updateRequestBodySchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  worktitle: z.string().optional(),
  theme: z.string().optional(),
});

export const linksPostRequestBodySchema = z.object({
  label: z.string(),
  url: z.url(),
});

export const linksPatchRequestBodySchema = z.object({
  label: z.string().optional(),
  url: z.url().optional(),
});

export const showcaseitemPostRequestSchema = z.object({
  file_title: z.string().nonempty(),
  filetype: z.enum(["certification", "project", "achievement", "document"]),
  description: z.string().optional(),
});

export const showcaseitemPatchRequestSchema = z.object({
  file_title: z.string().nonempty().optional(),
  filetype: z
    .enum(["certification", "project", "achievement", "document"])
    .optional(),
  description: z.string().optional(),
});
