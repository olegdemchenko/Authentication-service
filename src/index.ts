import express from "express";
import session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import dotenv from "dotenv";
import https from "https";
import cookieParser from "cookie-parser";
import passport from "passport";
import path from "path";
import { readFileSync } from "fs";

import dataSource from "./db/dataSource";
import router from "./routes";

dotenv.config();

dataSource
  .initialize()
  .then(() => {
    const redisClient = createClient({
      url: "redis://redis:6379",
    });

    redisClient.on("error", (e) => {
      console.log(`Cannot connect to Redis client: ${e}`);
    });

    redisClient.on("connect", () => {
      console.log("Connected to Redis successfully");
    });

    return redisClient.connect();
  })
  .then((redisClient) => {
    const app = express();
    const redisStore = new RedisStore({
      client: redisClient,
    });

    app.use(express.json());
    app.use(cookieParser());
    app.use(
      session({
        store: redisStore,
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET!,
        cookie: {
          secure: true,
          maxAge: 1000 * 60 * 60 * 6,
        },
      })
    );
    app.use(passport.authenticate("session"));
    app.use("/api", router);

    const server = https.createServer(
      {
        key: readFileSync(path.join(__dirname, "cert", "key.pem")),
        cert: readFileSync(path.join(__dirname, "cert", "cert.pem")),
      },
      app
    );

    server.listen(process.env.PORT, () => {
      console.log(`Server listens at ${process.env.PORT}`);
    });
  })
  .catch((e) => console.log("data source initialization error", e));
