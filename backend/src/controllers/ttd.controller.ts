import { Request, Response, NextFunction } from "express";
import * as ttdService from "../services/ttd.service";

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const { Lang, Skip, Limit, Type, ProvinceCode } = req.query;
    const data = await ttdService.fetchTtdWithLocal({
      Lang: Lang as any,
      Skip: Skip ? Number(Skip) : undefined,
      Limit: Limit ? Number(Limit) : undefined,
      Type: Type ? Number(Type) : undefined,
      ProvinceCode: ProvinceCode ? Number(ProvinceCode) : undefined
    });
    res.json(data);
  } catch (e) {
    next(e);
  }
}
