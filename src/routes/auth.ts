import { Router, RequestHandler } from "express";
import AuthController from "../controllers/auth";

const router = Router();

router
  .get("/me", AuthController.me as unknown as RequestHandler)
  .post("/signup", AuthController.signUp as unknown as RequestHandler)
  .post("/login", AuthController.login as unknown as RequestHandler)
  .post("/logout", AuthController.logout as unknown as RequestHandler);

export default router;
