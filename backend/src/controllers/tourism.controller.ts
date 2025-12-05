import { Request, Response, NextFunction } from "express";
import * as tourismService from "../services/tourism.service";

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await tourismService.list();
    res.json(items);
  } catch (e) {
    next(e);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const item = await tourismService.getById(id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await tourismService.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const item = await tourismService.update(id, req.body);
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await tourismService.remove(id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
}
