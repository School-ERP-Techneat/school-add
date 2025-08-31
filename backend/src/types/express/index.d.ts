export interface AuthUser {
  id: string;
  username: string;
  roleId: string;
  schoolCode: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
