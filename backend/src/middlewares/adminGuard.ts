import { Request, Response, NextFunction } from "express";

export function adminGuard(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
}
