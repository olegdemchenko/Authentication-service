import { NextFunction, Request, Response } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import _ from "lodash";
import { CustomRequest } from "../types";
import local from "../authStrategies/local";
import google from "../authStrategies/google";
import facebook from "../authStrategies/facebook";
import dataSource from "../db/dataSource";
import User from "../db/entities/User";
import sendVerificationEmail from "../utils/email/sendVerificationEmail";
import generateToken from "../utils/token/generateToken";
import verifyToken from "../utils/token/verifyToken";

passport.use(local);
passport.use(google);
passport.use(facebook);

type RequestUser = Express.User & { id: number };

const handleLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
  user: User
) => {
  req.logIn(user, (err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json(_.pick(user, ["name"]));
  });
};

passport.serializeUser((user, cb) => {
  const currentUser = user as RequestUser;
  process.nextTick(() => {
    cb(null, { id: currentUser.id });
  });
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => cb(null, user as Express.User));
});

class AuthController {
  private readonly userRepository = dataSource.getRepository(User);

  me = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ message: "bad credentials" });
    }
    const { id } = req.user as RequestUser;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    res.status(200).json(_.pick(user, ["name"]));
  };

  signUp = async (
    req: CustomRequest<{ username: string; password: string; email: string }>,
    res: Response
  ) => {
    const { username, password, email } = req.body;
    const existedUser = await this.userRepository.findOne({
      where: { name: username },
    });
    if (existedUser) {
      return res.status(401).json({ message: "username already exists" });
    }
    const existedEmail = await this.userRepository.findOne({
      where: { email },
    });

    if (existedEmail) {
      return res
        .status(409)
        .json({ message: `email ${email} has already been used` });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User();
    newUser.name = username;
    newUser.password = hashedPassword;
    newUser.email = email;
    await this.userRepository.save(newUser);
    const token = await generateToken({ userId: newUser.id });
    await sendVerificationEmail(email, token as string);
    res
      .status(200)
      .json({ status: `verification letter was sent to ${email}` });
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.query;
    const payload = await verifyToken(token as string);
    if (payload instanceof Error) {
      return res.status(409).json({ message: `Sorry, invalid link` });
    }

    const { userId } = payload;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(409).json({ message: `Sorry, invalid link` });
    }

    if (user.isVerified) {
      return res
        .status(409)
        .json({ message: "This link has already been used" });
    }

    user.isVerified = true;
    await this.userRepository.save(user);
    handleLogin(req, res, next, user);
  };

  login = (
    req: CustomRequest<{ username: string; password: string }>,
    res: Response,
    next: NextFunction
  ) => {
    passport.authenticate("local", (err: Error | null, user: User | null) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(404).json({ status: "not found" });
      }
      handleLogin(req, res, next, user);
    })(req, res, next);
  };

  logout = (req: Request, res: Response, next: NextFunction) => {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ status: "success" });
    });
  };

  google = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    );
  };

  googleCallback = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "google",
      { failureRedirect: "/api/auth/login" },
      (err: Error | null, user: User) => {
        if (err) {
          return next(err);
        }
        handleLogin(req, res, next, user);
      }
    )(req, res, next);
  };

  facebook = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("facebook")(req, res, next);
  };

  facebookCallback = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "facebook",
      { failureRedirect: "/api/auth/login" },
      (err: Error | null, user: User) => {
        if (err) {
          return next(err);
        }
        handleLogin(req, res, next, user);
      }
    )(req, res, next);
  };
}

export default new AuthController();
