import { Request, Response, NextFunction } from "express";
import * as favoritesService from "../services/favorites.service";

export async function listMine(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const items = await favoritesService.listByUser(userId);
    res.json(items);
  } catch (e) {
    next(e);
  }
}

export async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const fav = await favoritesService.add(userId, req.body);
    res.status(201).json(fav);
  } catch (e) {
    next(e);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const id = Number(req.params.id);
    await favoritesService.remove(userId, id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
}
