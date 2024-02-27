import dotenv from "dotenv";

dotenv.config();

type TokenType = "email_verification" | "user_authorization";

const tokenSecretsMap = {
  email_verification: process.env.EMAIL_VERIFICATION_TOKEN_SECRET!,
  user_authorization: process.env.USER_AUTHORIZATION_TOKEN_SECRET!,
};

const timesToExpire = {
  email_verification: "3h",
  user_authorization: "6h",
};

export { TokenType, tokenSecretsMap, timesToExpire };
