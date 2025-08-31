import { NextFunction, Request, Response } from "express";

export const asyncHandler = <T = any>(
  requestHandler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<T>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
