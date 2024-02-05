import { sign } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

async function generateToken(payload: {
  userId: number;
}): Promise<string | Error> {
  const { VERIFICATION_TOKEN_SECRET } = process.env;
  return new Promise((resolve, reject) => {
    sign(
      payload,
      VERIFICATION_TOKEN_SECRET!,
      { expiresIn: 60 * 60 * 3 },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token!);
        }
      }
    );
  });
}

export default generateToken;
