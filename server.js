import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./src/routes/index.js";
import dotenv from "dotenv";
import morgan from "morgan";
import startJobs from "./src/jobs/index.js";

dotenv.config();

const PORT = process.env.PANEL_PORT || 3000;

startJobs();

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
