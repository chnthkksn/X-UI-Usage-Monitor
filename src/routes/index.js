import { Router } from "express";
import controller from "../controller/index.js";
import checkAdmin from "../middleware/index.js";

const router = Router();

router.get("/", controller.home);

router.get("/login", controller.login);

router.get("/admin", checkAdmin, controller.admin);

router.get("/api/logout", controller.logout);

router.post("/api/verifyLogin", controller.authLogin);

router.get("/api/getDbs", controller.getDbs);

router.get("/api/getTable", controller.getTable);

router.get("/api/usage/:email", controller.getUsageStats);

export default router;
