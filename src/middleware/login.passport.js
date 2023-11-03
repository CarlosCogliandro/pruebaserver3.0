import passport from "passport"
import local from "passport-local"
import usersModel from "../dao/mongoDB/models/user.model.js"
import { createHash, isValidPassword } from "./bcrypt.js"
import jwt from "passport-jwt"
import CartService from '../services/cart.service.js'

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const LocalStrategy = local.Strategy;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }
  return token;
};

// Passport Strategies
const initializePassport = () => {
  passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: "email" },
    async (req, username, password, done) => {
      const { first_name, last_name, email, age, avatar } = req.body;
      try {
        let user = await usersModel.findOne({ email: username });
        if (user) {
          console.log(email + " ya se encuentra registrado!");
          return done(null, false);
        }
        user = {
          first_name,
          last_name,
          email,
          age,
          avatar,
          password: createHash(password),
          rol,
          admin: false,
          cart: await CartService.createCart()
        };
        if (user.email == "carloscogliandro22@gmail.com" && password === "contraseña") {
          console.log("Asignando rol de admin");
          user.rol = "admin";
        } else {
          console.log("Asignando rol de usuario");
          user.rol = "user";
        }
        let result = await usersModel.create(user);
        if (result) {
          return done(null, result);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
  );

  passport.use("login", new LocalStrategy({ usernameField: "email", passwordField: "password"},
    async (username, password, done) => {
      try {
        let user = await usersModel.findOne({ email: username });
        if (!user) {
          return done(null, false, { message: "Usuario incorrecto." });
        }
        if (!isValidPassword(user, password)) {
          return done(null, false, { message: "Contraseña incorrecta." });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
  );

  passport.use("jwt", new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: "palabraSecretaQueNadieVea",
  },
    async (jwt_payload, done) => {
      try {
        const user = await usersModel.findOne({ email: jwt_payload.email });
        if (!user) {
          return done(null, false, { message: "Usuario no encontrado en nuestra base de datos" })
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }))
}

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  let user = await usersModel.findById(id)
  done(null, user)
})

export default initializePassport;




