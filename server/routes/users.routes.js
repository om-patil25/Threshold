import e from "express";
import db from "../db/index.js";
import { usersTable } from "../models/user.model.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import {
  loginPostRequestBodySchema,
  signupPostRequestBodySchema,
  updateRequestBodySchema,
} from "../validations/requests.validation.js";
import { createUserToken, storeUserToken } from "../utils/token.js";
import { requireAuthentication } from "../middlewares/auth.middleware.js";
import { validateData } from "../middlewares/validation.middleware.js";
import { linksTable } from "../models/links.model.js";
import { showcaseItems } from "../models/showcase_items.model.js";
import upload from "../middlewares/fileUpload.middleware.js";
import {
  generateUniqueFilename,
  getFileNameFromUrlFormulae,
  removeFile,
  uploadFile,
} from "../utils/filehandler.js";
import { isUsernameAvailable } from "../utils/userhandler.js";
import { storageBucket } from "../config/supabase.js";
import { updatesTable } from "../models/updates.model.js";
import { analytics_eventTable } from "../models/analytics_event.model.js";

const router = e.Router();

router.get("/auth/check-username/:username", async (req, res) => {
  //check available username for user at homepage
  try {
    res.status(200).send(await isUsernameAvailable(req.params.username));
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

      if (!(await isUsernameAvailable(username)).available)
        return res
          .status(400)
          .json({ message: "this username is taken or reserved!" });

      const [existingUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));

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
  try {
    const user_id = req.user.user_id;
    const [userAdmin] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        username: usersTable.username,
        profileimage: usersTable.profileimage,
        bio: usersTable.bio,
        worktitle: usersTable.worktitle,
        createdat: usersTable.createdAt,
        updateat: usersTable.updatedAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, user_id));
    res.status(200).json({ user: userAdmin });
  } catch (err) {
    res.status(500).json({ error: "something went wrong!" });
  }
});

router.patch(
  "/users/me",
  requireAuthentication,
  upload.single("profileimage"),
  validateData(updateRequestBodySchema),
  async (req, res) => {
    //onboarding requests
    try {
      const user_id = req.user.user_id;

      const [olduserProfile] = await db
        .select({ profileimage: usersTable.profileimage })
        .from(usersTable)
        .where(eq(usersTable.id, user_id));

      const { name, bio, worktitle } = req.body;
      let profileimage = olduserProfile.profileimage;
      if (req.file) {
        const { buffer, mimetype, originalname } = req.file;
        const profilename = "profile-" + originalname;
        const fileName = generateUniqueFilename(user_id, profilename);
        const { url } = await uploadFile(
          buffer,
          storageBucket,
          fileName,
          mimetype,
        );

        profileimage = url;
      }

      const [updateUser] = await db
        .update(usersTable)
        .set({ name, bio, worktitle, profileimage })
        .where(eq(usersTable.id, user_id))
        .returning({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          username: usersTable.username,
          profileimage: usersTable.profileimage,
          bio: usersTable.bio,
          worktitle: usersTable.worktitle,
          createdat: usersTable.createdAt,
          updateat: usersTable.updatedAt,
        });

      if (req.file && olduserProfile.profileimage) {
        const old_profilename = getFileNameFromUrlFormulae(
          olduserProfile.profileimage,
        );
        await removeFile(storageBucket, old_profilename);
      }

      res
        .status(200)
        .json({ success: "info updated", newUserData: updateUser });
    } catch (err) {
      res.status(500).json({ error: "something went wrong" });
    }
  },
);

//public acess to profile
router.get("/users/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const [user] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        worktitle: usersTable.worktitle,
        bio: usersTable.bio,
        profileimage: usersTable.profileimage,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.username, username));

    if (!user)
      return res
        .status(404)
        .json({ error: "user with this username not found!" });

    const [links, showcase_items, updates] = await Promise.all([
      db.select().from(linksTable).where(eq(linksTable.user_id, user.id)),
      db.select().from(showcaseItems).where(eq(showcaseItems.user_id, user.id)),
      db.select().from(updatesTable).where(eq(updatesTable.user_id, user.id)),
    ]);

    db.insert(analytics_eventTable)
      .values({
        user_id: user.id,
        event_type: "profile_view",
      })
      .catch((err) => console.log("failed to log profile view" + err));

    const { id, ...publicUser } = user;
    res.status(200).json({
      success: "data fetched successfully!",
      publicUser,
      links,
      showcase_items,
      updates,
    });
  } catch (err) {
    res.status(500).json({ error: "something went wrong" });
  }
});

export default router;
