import { Request } from "express";
import { VerifyCallback } from "passport-google-oauth20";
import { Strategy as FacebookStrategy, Profile } from "passport-facebook";
import dotenv from "dotenv";
import dataSource from "../db/dataSource";
import User from "../db/entities/User";

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
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { facebookId: profile.id },
    });
    if (!user) {
      const newUser = new User();
      newUser.name = profile.displayName;
      newUser.facebookId = profile.id;
      await userRepository.save(newUser);
      done(null, newUser);
    } else {
      done(null, user);
    }
  }
);
