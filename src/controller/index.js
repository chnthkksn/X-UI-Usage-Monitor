import jwt from "jsonwebtoken";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import scanner from "../lib/scanner.js";
import { getDbs } from "../lib/updater.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const user = process.env.PANEL_USERNAME;
const pword = process.env.PANEL_PASSWORD;

const controller = {
  authLogin: (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
      if (username === user && password === pword) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.status(200).json({ message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  },

  home: (req, res) => {
    res.sendFile(join(__dirname, "../../public/index.html"));
  },

  login: (req, res) => {
    res.sendFile(join(__dirname, "../../public/login.html"));
  },

  logout: (req, res) => {
    if (req.cookies.token) {
      res.clearCookie("token");
      return res.status(200).json({ status: "success" });
    }
    return res.status(404).json({ message: "No token found" });
  },

  admin: (req, res) => {
    res.sendFile(join(__dirname, "../../public/admin.html"));
  },

  getDbs: (req, res) => {
    getDbs();
    res.send("Dbs updated, check console for more info");
  },

  getTable: async (req, res) => {
    const data = await scanner.fetchAll();
    if (data.length > 0) res.status(200).json(data);
    else res.status(404).json({ message: "No data found" });
  },

  getUsageStats: async (req, res) => {
    const email = req.params.email;
    const usage = await scanner.fetchInfo(email);
    if (usage.length > 0) res.status(200).json(usage);
    else res.status(404).json({ message: "No data found" });
  },
};

export default controller;
