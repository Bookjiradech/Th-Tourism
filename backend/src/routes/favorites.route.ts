import { Router } from "express";
import * as favoritesController from "../controllers/favorites.controller";
import { authGuard } from "../middlewares/authGuard";

const router = Router();

router.get("/", authGuard, favoritesController.listMine);
router.post("/", authGuard, favoritesController.add);
router.delete("/:id", authGuard, favoritesController.remove);

export default router;
