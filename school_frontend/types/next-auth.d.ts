import "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      schoolCode: string;
    };
    accessToken: string;
  }

  interface User {
    user: {
      id: string;
      email: string;
      schoolCode: string;
    };
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      email: string;
      schoolCode: string;
    };
    accessToken: string;
  }
}
