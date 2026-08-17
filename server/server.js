import express, { response } from "express";
import db from "./db/index.js";
import { usersTable } from "./models/user.model.js";
import { eq } from "drizzle-orm";
import users from "./routes/users.routes.js";
import links from "./routes/links.route.js";
import showcase_items from "./routes/showcase_items.route.js";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { authenticationMiddleWare } from "./middlewares/auth.middleware.js";
import upload from "./middlewares/fileUpload.middleware.js";
import { uploadFile, generateUniqueFilename } from "./utils/filehandler.js";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, //for later use for frontend to connect with backend without browser blockage
  }),
);
app.use(authenticationMiddleWare);

app.post("/api/testupload", upload.single("image"), async (req, res) => {
  try {
    console.log(req.file);
    const url = await uploadFile(
      req.file.buffer,
      "showcase_items",
      generateUniqueFilename(req.user.user_id, req.file.originalname),
      req.file.mimetype,
    );
    res.json({ recieved: true, url: url });
  } catch (err) {
    res.json({ error: err });
  }
});
app.use("/api", users);
app.use("/api", links);
app.use("/api", showcase_items);

//api building in progress
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
