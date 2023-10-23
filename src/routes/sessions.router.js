import express from "express";
import passport from "passport";
import { passportCall, authorization } from "../middleware/passAuth.js";
import UserController from "../controllers/user.controller.js";
import AuthController from "../controllers/auth.controller.js";

const router = express.Router();
const userController = new UserController();
const authController = new AuthController();

router.post("/login", (req, res) => authController.login(req, res));

router.post("/register", userController.register.bind(userController));

router.get("/restore", userController.restorePassword.bind(userController));

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { });
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
  console.log("GitHub Callback Route");
  authController.githubCallback(req, res);
});

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }), async (req, res) => { });
router.get('/googlecallback', passport.authenticate('google', { failureRedirect: "/login" }), async (req, res) => {
  console.log("Google Callback Route");
  authController.googleCallback(req, res);
});

router.post("/logout", (req, res) => authController.logout(req, res));

router.get("/current", passportCall("jwt"), authorization("user"), (req, res) => {
  console.log(req.cookies);
  userController.currentUser(req, res)
});

export default router;