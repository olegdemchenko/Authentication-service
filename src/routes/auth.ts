import { Router, RequestHandler } from "express";
import AuthController from "../controllers/auth";

const router = Router();

router
  .get("/me", AuthController.me as unknown as RequestHandler)
  .post("/signup", AuthController.signUp as unknown as RequestHandler)
  .post("/login", AuthController.login as unknown as RequestHandler)
  .post("/logout", AuthController.logout as unknown as RequestHandler)
  .get("/google", AuthController.google as unknown as RequestHandler)
  .get(
    "/google-redirect",
    AuthController.googleCallback as unknown as RequestHandler
  )
  .get("/facebook", AuthController.facebook)
  .get("/facebook-redirect", AuthController.facebookCallback);

export default router;
