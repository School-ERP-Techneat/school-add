import jwt from "jsonwebtoken";
import { AuthUser } from "../types/express";

export const createAccessToken = (authUser: AuthUser) => {
  const accessToken = jwt.sign(authUser, process.env.JWT_SECRET!);
  return accessToken;
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
