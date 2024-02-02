import { Profile as FacebookProfile } from "passport-facebook";
import {
  Profile as GoogleProfile,
  VerifyCallback,
} from "passport-google-oauth20";
import dataSource from "../db/dataSource";
import User from "../db/entities/User";

async function verifyProfile(
  socialMedia: "google" | "facebook",
  profile: GoogleProfile | FacebookProfile,
  done: VerifyCallback
) {
  const socialMediaIds = {
    google: "googleId",
    facebook: "facebookId",
  } as const;

  const userRepository = dataSource.getRepository(User);
  const user = await userRepository.findOne({
    where: { [socialMediaIds[socialMedia]]: profile.id },
  });
  if (!user) {
    const newUser = new User();
    newUser.name = profile.displayName;
    newUser[socialMediaIds[socialMedia]] = profile.id;
    await userRepository.save(newUser);
    done(null, newUser);
  } else {
    done(null, user);
  }
}

export default verifyProfile;
