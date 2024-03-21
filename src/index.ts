import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";

import RedisStore from "connect-redis";
import dataSource from "./db/dataSource";
import redisClient from "./redisClient";
import router from "./routes";
import { sessionExpiration } from "./consts";

dotenv.config();

dataSource
  .initialize()
  .then(() => redisClient)
  .then((client) => {
    const app = express();
    const store = new RedisStore({
      client,
    });
    app.use(express.json());
    app.use(cookieParser());
    app.use(
      session({
        store,
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET!,
        cookie: {
          secure: true,
          maxAge: 1000 * sessionExpiration,
        },
      }),
    );
    app.use(passport.authenticate("session"));
    app.use("/api", router);

    app.listen(process.env.PORT, () => {
      console.log(`Server listens at ${process.env.PORT}`);
    });
  })
  .catch((e) => console.log("data source initialization error", e));
