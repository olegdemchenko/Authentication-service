import { Request } from "express";
import {
  GoogleCallbackParameters,
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import dotenv from "dotenv";
import dataSource from "../db/dataSource";
import User from "../db/entities/User";

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
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { googleId: profile.id } });
    if (!user) {
      const newUser = new User();
      newUser.name = profile.displayName;
      newUser.googleId = profile.id;
      await userRepository.save(newUser);
      done(null, newUser);
    } else {
      done(null, user);
    }
  }
);
