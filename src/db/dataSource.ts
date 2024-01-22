import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import User from "./entities/User";

dotenv.config();

export default new DataSource({
  type: "postgres",
  url: process.env.POSTGRES_URL,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  synchronize: true,
  logging: true,
  entities: [User],
  migrations: [],
  subscribers: [],
});
