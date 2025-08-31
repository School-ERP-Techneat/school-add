import NextAuth, { AuthError, CredentialsSignin, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "./lib/api";
import { ApiResponse } from "./types";
import "next-auth/jwt";
import { JWT } from "next-auth/jwt";
import { AxiosError, AxiosHeaders } from "axios";

class InvalidLoginError extends CredentialsSignin {
  constructor(message: string) {
    super();
    this.code = message;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        try {
          const email = credentials.email as String;
          const password = credentials.password as String;

          if (!email || !password) {
            console.log("Invalid credentials");
            return null;
          }

          const response = await api.post<ApiResponse>("/user/login", {
            email,
            password,
          });
          if (!response.data.success) {
            return null;
          }
          const { accessToken, user } = response.data.data;
          return { accessToken, user };
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          console.log(
            "Authorization error:",
            axiosError.response?.data.message
          );
          throw new InvalidLoginError(
            axiosError.response?.data.message || "Login failed"
          );
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token.user = user.user), (token.accessToken = user.accessToken);
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user = token.user;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (
        url.startsWith(baseUrl + "/api/auth/signin") ||
        url === baseUrl + "/login"
      ) {
        return baseUrl + "/dashboard";
      }

      // If the url is relative (like /profile, /settings), allow it
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Default fallback
      return baseUrl + "/dashboard";
    },
  },
  pages: {
    newUser: "/login",
    signIn: "/login",
    signOut: "/",
  },
});
