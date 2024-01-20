import express from "express";
import dotenv from "dotenv";
import https from "https";
import path from "path";
import { readFileSync } from "fs";
import dataSource from "./db/dataSource";

dotenv.config();

dataSource
  .initialize()
  .then(() => {
    const app = express();
    app.use(express.json());

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
