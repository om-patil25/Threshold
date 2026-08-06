import express, { response } from "express";
import db from "./db/index.js";
import { usersTable } from "./models/user.model.js";
import { eq } from "drizzle-orm";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/auth/check-username/:username", async (req, res) => {
  //check available username for user at homepage
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, req.params.username))
      .limit(1);

    if (user.length) {
      res.json({ available: "false" });
    } else {
      res.json({ available: "true" });
      console.log(user.length);
    }
  } catch (err) {
    res.status(401).json({ error: "something went wrong" });
  }
});

app.post("/api/auth/signup", async (req, res) => {
  //create user
  try {
    const data = await db.insert(usersTable).values(req.body).returning();
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: "something went wrong" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  //check existing user and his creadentials
  try {
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, req.body.email));

    existingUser.length
      ? res.json({ message: existingUser })
      : res.json({ message: "new to Mylink? Signup to use" });
  } catch (err) {
    res.status(404);
  }
});

app.get("/api/users/me", (req, res) => {
  //get users admin page details
  res.send();
});

app.patch("/api/users/me", (req, res) => {
  //onboarding requests
  res.send("//");
});

app.get("/api/users/:username");

//api building in progress
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
