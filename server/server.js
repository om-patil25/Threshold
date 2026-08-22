import express from "express";
import users from "./routes/users.routes.js";
import links from "./routes/links.route.js";
import showcase_items from "./routes/showcase_items.route.js";
import updates from "./routes/updates.route.js";
import analytics from "./routes/analytics.route.js";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { authenticationMiddleWare } from "./middlewares/auth.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
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
app.use("/api", users);
app.use("/api", links);
app.use("/api", showcase_items);
app.use("/api", updates);
app.use("/api", analytics);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
