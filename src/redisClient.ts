import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  url: `redis://redis:${process.env.REDIS_PORT}`,
});

redisClient.on("error", (e) => {
  console.log(`Cannot connect to Redis client: ${e}`);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis successfully");
});

export default redisClient.connect();
