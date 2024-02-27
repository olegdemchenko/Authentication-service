import { sign } from "jsonwebtoken";
import { type TokenType, tokenSecretsMap, timesToExpire } from "./const";

async function generateToken(
  type: TokenType,
  payload: {
    userId: number;
  },
): Promise<string | Error> {
  return new Promise((resolve, reject) => {
    sign(
      payload,
      tokenSecretsMap[type],
      { expiresIn: timesToExpire[type] },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token!);
        }
      },
    );
  });
}

export default generateToken;
