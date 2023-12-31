import passport from "passport";
import GitHubStrategy from "passport-github2";
import GoogleStrategy from 'passport-google-oidc';
import usersModel from "../dao/mongoDB/models/user.model.js"
import { GITHUB_USER, GITHUB_PASS, GOOGLE_USER, GOOGLE_PWD } from "../config/config.js";
import AuthenticationService from "../services/auth.service.js";

const initializeStrategiesPassport = () => {

    // Inicio de sesion con Git-Hub
    passport.use("github", new GitHubStrategy({
        clientID: GITHUB_USER,
        clientSecret: GITHUB_PASS,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const authService = new AuthenticationService();
            console.log("Perfil: ", JSON.stringify(profile, null, 2));
            const user = await authService.githubCallback(profile);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error);
        }
    }));

    // Inicio de sesion con Google
    passport.use("google", new GoogleStrategy({
        clientID: GOOGLE_USER,
        clientSecret: GOOGLE_PWD,
        callbackURL: "http://localhost:8080/api/sessions/googlecallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const authService = new AuthenticationService();
            const user = await authService.googleCallback(profile);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await usersModel.findById(id);
        done(null, user);
    });
};

export default initializeStrategiesPassport;
