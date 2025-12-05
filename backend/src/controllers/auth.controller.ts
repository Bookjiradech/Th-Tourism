import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await authService.register(email, password);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

export async function makeAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    const result = await authService.makeAdmin(email);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, newPassword } = req.body;
    const result = await authService.changePassword(email, newPassword);
    res.json(result);
  } catch (e) {
    next(e);
  }
}
