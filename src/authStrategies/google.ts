import { Request } from "express";
import {
  GoogleCallbackParameters,
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import dotenv from "dotenv";
import verifyProfile from "./verifyProfile";

dotenv.config();

export default new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "https://localhost:443/api/auth/google-redirect",
    passReqToCallback: true,
  },
  async (
    req: Request,
    accessToken: string,
    refreshToken: string,
    params: GoogleCallbackParameters,
    profile: Profile,
    done: VerifyCallback
  ) => {
    await verifyProfile("google", profile, done);
  }
);
