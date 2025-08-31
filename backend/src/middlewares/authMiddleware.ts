import { NextFunction, Request, Response } from "express";
import { AuthUser } from "../types/express";
import { verifyToken } from "../utils/jwtUtil";

export async function verifyAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.headers["authorization"]?.replace("Bearer ", "");

    if (!accessToken) {
      return res.status(401).json({ message: "unauthorized request" });
    }
    const decodedToken = verifyToken(accessToken);

    if (!decodedToken) return res.status(400).json("unauthorized request");

    req.user = decodedToken as AuthUser;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
}
