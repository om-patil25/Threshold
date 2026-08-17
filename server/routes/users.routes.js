import e from "express";
import { Router } from "express";
import db from "../db/index.js";
import { usersTable } from "../models/user.model.js";
import { eq } from "drizzle-orm";
import bcrypt, { hash } from "bcrypt";
import {
  loginPostRequestBodySchema,
  signupPostRequestBodySchema,
  updateRequestBodySchema,
} from "../validations/requests.validation.js";
import { createUserToken, storeUserToken } from "../utils/token.js";
import { requireAuthentication } from "../middlewares/auth.middleware.js";
import { email } from "zod";
import { validateData } from "../middlewares/validation.middleware.js";

const router = e.Router();

router.get("/auth/check-username/:username", async (req, res) => {
  //check available username for user at homepage
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, req.params.username))
      .limit(1);

    if (user) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  } catch (err) {
    res.status(500).json({ error: "something went wrong" });
  }
});

router.post(
  "/auth/signup",
  validateData(signupPostRequestBodySchema),
  async (req, res) => {
    //create user
    try {
      const { name, email, username, password } = req.body;
      const [existingUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

      if (existingUser) {
        return res
          .status(400)
          .json({ error: "user with this email already exists!" });
      } else {
        const hash = await bcrypt.hash(password, 10);
        const [user] = await db
          .insert(usersTable)
          .values({
            name,
            email,
            username,
            password: hash,
          })
          .returning({ id: usersTable.id, username: usersTable.username });

        const token = createUserToken({
          user_id: user.id,
          username: user.username,
        });
        storeUserToken(res, token);

        res.status(201).json({ success: "user created!", user_id: user.id });
      }
    } catch (err) {
      res.status(500).json({ error: "something went wrong" });
    }
  },
);

router.post(
  "/auth/login",
  validateData(loginPostRequestBodySchema),
  async (req, res) => {
    //check existing user and his creadentials
    try {
      const { email, password } = req.body;
      const [existingUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));

      if (!existingUser)
        return res.status(400).json({ error: "New to Mylink? Signup to use" });

      const passwordmatchResult = await bcrypt.compare(
        password,
        existingUser.password,
      );

      if (!passwordmatchResult) {
        return res.status(400).json({ error: "password incorrect!" });
      }
      const token = createUserToken({
        user_id: existingUser.id,
        username: existingUser.username,
      });
      storeUserToken(res, token);

      res.json({ success: "logged in successfuly" });
    } catch (err) {
      res.status(500).json({ error: "something went wrong" });
    }
  },
);

router.post("/auth/logout", requireAuthentication, async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({ success: "logged out successfully!" });
  } catch (err) {
    res.status(500).json({ error: "something went wrong" });
  }
});

router.get("/users/me", requireAuthentication, async (req, res) => {
  //get users admin page details
  const email = req.body.email;
  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  console.log(req.user);
  res.status(200).json({ user: existingUser });
});

router.patch(
  "/users/me",
  requireAuthentication,
  validateData(updateRequestBodySchema),
  async (req, res) => {
    //onboarding requests
    try {
      const { name, bio, worktitle } = req.body;
      const [user] = await db
        .update(usersTable)
        .set({ name, bio, worktitle })
        .where(eq(usersTable.id, req.user.user_id))
        .returning({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          username: usersTable.username,
          bio: usersTable.bio,
          worktitle: usersTable.worktitle,
          createdat: usersTable.createdAt,
        });

      res.status(200).json({ success: "info updated", newUserData: user });
    } catch (err) {
      res.status(500).json({ error: "something went wrong" });
    }
  },
);

//public acess to links
// router.get("/api/users/:username");

//links
// router.get("/api/links");

export default router;
