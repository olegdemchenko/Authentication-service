import express from "express";
import dotenv from "dotenv";
import dataSource from "./db/dataSource";

dotenv.config();

dataSource
  .initialize()
  .then(() => {
    const app = express();
    app.use(express.json());
    app.listen(process.env.PORT, () => {
      console.log(`server listens at ${process.env.PORT}`);
    });
  })
  .catch((e) => console.log("data source initialization error", e));
