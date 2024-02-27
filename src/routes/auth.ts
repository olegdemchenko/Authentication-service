import { Router } from "express";
import AuthController from "../controllers/auth";

const router = Router();

router
  .get("/me", AuthController.me)
  .post("/signup", AuthController.signUp)
  .get("/verify-email", AuthController.verifyEmail)
  .post("/login", AuthController.login)
  .post("/logout", AuthController.logout)
  .get("/google", AuthController.authenticateGoogleAccount)
  .get("/google-redirect", AuthController.handleGoogleAuthRedirect)
  .get("/facebook", AuthController.authenticateFacebookAccount)
  .get("/facebook-redirect", AuthController.handleFacebookAuthRedirect)
  .get("/authenticate", AuthController.authenticateUser);

export default router;
