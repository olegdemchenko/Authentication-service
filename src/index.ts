import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import https from "https";
import cookieParser from "cookie-parser";
import passport from "passport";
import path from "path";
import { readFileSync } from "fs";

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

    const server = https.createServer(
      {
        key: readFileSync(path.join(__dirname, "cert", "key.pem")),
        cert: readFileSync(path.join(__dirname, "cert", "cert.pem")),
      },
      app,
    );

    server.listen(process.env.PORT, () => {
      console.log(`Server listens at ${process.env.PORT}`);
    });
  })
  .catch((e) => console.log("data source initialization error", e));
