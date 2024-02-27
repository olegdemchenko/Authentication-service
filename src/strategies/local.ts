import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../db/entities/User";
import dataSource from "../db/dataSource";

export default new LocalStrategy((username, password, done) => {
  const userRepository = dataSource.getRepository(User);
  userRepository
    .findOne({ where: { name: username } })
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
      bcrypt.compare(password, user.password, (err, same) => {
        if (err) {
          return done(err);
        }
        if (!same) {
          return done(null, false);
        }
        if (!user.isVerified) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
    .catch((e) => done(e));
});
