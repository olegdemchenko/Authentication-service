import { NextFunction, Request, Response } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import _ from "lodash";
import { CustomRequest } from "../types";
import local from "../authStrategies/local";
import google from "../authStrategies/google";
import dataSource from "../db/dataSource";
import User from "../db/entities/User";

passport.use(local);
passport.use(google);

type RequestUser = Express.User & { id: number };

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
    req: CustomRequest<{ username: string; password: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { username, password } = req.body;
    const existedUser = await this.userRepository.findOne({
      where: { name: username },
    });
    if (existedUser) {
      return res.status(401).json({ message: "username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User();
    newUser.name = username;
    newUser.password = hashedPassword;
    await this.userRepository.save(newUser);

    req.logIn(newUser, (err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json(_.pick(newUser, ["name"]));
    });
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
      req.logIn(user, (loginErr) => {
        if (err) {
          return next(loginErr);
        }
        res.status(200).json(_.pick(user, ["name"]));
      });
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
        req.logIn(user, (loginErr) => {
          if (err) {
            return next(loginErr);
          }
          res.status(200).json(_.pick(user, ["name"]));
        });
      }
    )(req, res, next);
  };
}

export default new AuthController();
