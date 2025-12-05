import { Router } from "express";
import authRouter from "./auth.route";
import ttdRouter from "./ttd.route";
import tourismRouter from "./tourism.route";
import favoritesRouter from "./favorites.route";

export const router = Router();

router.use("/auth", authRouter);
router.use("/ttd", ttdRouter);
router.use("/tourism", tourismRouter);
router.use("/favorites", favoritesRouter);
