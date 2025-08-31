import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

export const validate =
  (schema: ZodType<any, any, any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ error: err.issues });
      }
      next(err);
    }
  };
