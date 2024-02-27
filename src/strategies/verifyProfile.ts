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
  done: VerifyCallback,
) {
  const socialMediaIds = {
    google: "googleId",
    facebook: "facebookId",
  } as const;

  const userRepository = dataSource.getRepository(User);
  const profileEmail = profile?.emails?.[0].value;
  let user: User | null;
  if (profileEmail) {
    user = await userRepository.findOne({
      where: { email: profileEmail },
    });
  } else {
    user = await userRepository.findOne({
      where: [{ [socialMediaIds[socialMedia]]: profile.id }],
    });
  }
  if (!user) {
    const newUser = new User();
    newUser.name = profile.displayName;
    newUser[socialMediaIds[socialMedia]] = profile.id;
    if (profileEmail) {
      newUser.email = profileEmail;
    }
    await userRepository.save(newUser);
    done(null, newUser);
  } else {
    if (!user[socialMediaIds[socialMedia]]) {
      user[socialMediaIds[socialMedia]] = profile.id;
      await userRepository.save(user);
    }
    done(null, user);
  }
}

export default verifyProfile;
