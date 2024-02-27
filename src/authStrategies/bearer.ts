import { Strategy as BearerStrategy } from "passport-http-bearer";
import _ from "lodash";
import dataSource from "../db/dataSource";
import User from "../db/entities/User";
import verifyToken from "../utils/token/verifyToken";

export default new BearerStrategy(async (token, done) => {
  const userRepository = dataSource.getRepository(User);
  try {
    const { userId } = (await verifyToken("user_authorization", token)) as {
      userId: number;
    };
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return done(null, false);
    }
    return done(null, _.omit(user, "password"), { scope: "all" });
  } catch (e) {
    return done(e);
  }
});
