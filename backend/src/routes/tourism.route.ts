import { Router } from "express";
import * as tourismController from "../controllers/tourism.controller";
import { authGuard } from "../middlewares/authGuard";
import { adminGuard } from "../middlewares/adminGuard";

const router = Router();

// Public: list สถานที่ที่เก็บใน DB (ถ้าจะโชว์รวมกับ TTD)
router.get("/", tourismController.list);
router.get("/:id", tourismController.getById);

// Admin only:
router.post("/", authGuard, adminGuard, tourismController.create);
router.put("/:id", authGuard, adminGuard, tourismController.update);
router.delete("/:id", authGuard, adminGuard, tourismController.remove);

export default router;
