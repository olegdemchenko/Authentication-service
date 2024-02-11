import { Request } from "express";
import { VerifyCallback } from "passport-google-oauth20";
import { Strategy as FacebookStrategy, Profile } from "passport-facebook";
import dotenv from "dotenv";
import verifyProfile from "./verifyProfile";

dotenv.config();

export default new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    callbackURL: "https://localhost:443/api/auth/facebook-redirect",
    passReqToCallback: true,
  },
  async (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) => {
    await verifyProfile("facebook", profile, done);
  }
);
