import { createCookieSessionStorage } from "remix";
import { Authenticator, AuthorizationError } from "remix-auth";
import type { GitHubExtraParams, GitHubProfile } from "remix-auth-github";
import { GitHubStrategy } from "remix-auth-github";
import { Role } from "./type";
import { db } from "./utils/db.server";
import { user, user_role_enum } from "@prisma/client";

if (!process.env.GITHUB_CLIENT_ID) {
  throw new Error("GITHUB_CLIENT_ID is required");
}

if (!process.env.GITHUB_CLIENT_SECRET) {
  throw new Error("GITHUB_CLIENT_SECRET is required");
}

if (!process.env.BASE_URL) {
  throw new Error("BASE_URL is required");
}

if (!process.env.SERVER_SECRET) {
  throw new Error("SERVER_SECRET is required");
}

const BASE_URL = process.env.BASE_URL;

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SERVER_SECRET], // This should be an env variable
    secure: process.env.NODE_ENV === "production",
  },
});

export const auth = new Authenticator<{
  profile: GitHubProfile;
  user: user;
  accessToken: string;
  // extraParams: GitHubExtraParams;
}>(sessionStorage);

auth.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: new URL("/auth/github/callback", BASE_URL).toString(),
    },
    async ({ profile, accessToken }) => {
      if (!profile._json.email.includes("@kmitl.ac.th")) {
        if (profile._json.email !== process.env.ADMIN_EMAIL) {
          throw new AuthorizationError("Email is not from KMITL");
        }
      }
      const user = await db.user.findFirst({
        where: {
          id: profile._json.id,
        },
      });
      if (!user) {
        const isAdmin = process.env.ADMIN_EMAIL === profile._json.email;
        const newUser = await db.user.create({
          data: {
            id: profile._json.id,
            name: profile._json.name,
            email: profile._json.email,
            avatar_url: profile._json.avatar_url,
            role: isAdmin ? user_role_enum.admin : user_role_enum.student,
            is_admin: isAdmin ? true : false,
          },
        });
        return { profile, user: newUser, accessToken };
      }
      return { profile, user, accessToken };
    }
  )
);
