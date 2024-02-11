import { verify } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

async function verifyToken(token: string): Promise<{ userId: number } | Error> {
  const { VERIFICATION_TOKEN_SECRET } = process.env;

  return new Promise((resolve, reject) => {
    verify(token, VERIFICATION_TOKEN_SECRET!, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload as { userId: number });
      }
    });
  });
}

export default verifyToken;
