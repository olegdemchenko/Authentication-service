import dotenv from "dotenv";
import { sessionExpiration, emailVerificationExpiration } from "../../consts";

dotenv.config();

type TokenType = "email_verification" | "user_authorization";

const tokenSecretsMap = {
  email_verification: process.env.EMAIL_VERIFICATION_TOKEN_SECRET!,
  user_authorization: process.env.USER_AUTHORIZATION_TOKEN_SECRET!,
};

const timesToExpire = {
  email_verification: `${emailVerificationExpiration / 3600}h`,
  user_authorization: `${sessionExpiration / 3600}h`,
};

export { TokenType, tokenSecretsMap, timesToExpire };
