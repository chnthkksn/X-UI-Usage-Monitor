import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./src/routes/index.js";
import dotenv from "dotenv";
import { getDbs } from "./src/lib/updater.js";

dotenv.config();

const PORT = process.env.PANEL_PORT || 3000;

getDbs();
setInterval(() => {
  getDbs();
}, 600000); // 10 minutes in milliseconds

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
