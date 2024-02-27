import { verify } from "jsonwebtoken";
import { type TokenType, tokenSecretsMap } from "./const";

async function verifyToken(
  type: TokenType,
  token: string,
): Promise<{ userId: number } | Error> {
  return new Promise((resolve, reject) => {
    verify(token, tokenSecretsMap[type], (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload as { userId: number });
      }
    });
  });
}

export default verifyToken;
