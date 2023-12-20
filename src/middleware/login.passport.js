import passport from "passport"
import local from "passport-local"
import usersModel from "../dao/mongoDB/models/user.model.js"
import { createHash, isValidPassword } from "./bcrypt.js"
import jwt from "passport-jwt"
import CartService from "../services/cart.service.js"
import UserService from "../services/user.service.js"
import { ADMIN_EMAIL, ADMIN_PASSWORD, PREMIUM_EMAIL, PREMIUM_PASSWORD, JWT_KEY } from "../config/config.js"

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const LocalStrategy = local.Strategy;
const userService = new UserService();
const cartService = new CartService();

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
        };
        if (user.email == ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          console.log("Asignando rol de admin");
          user.rol = 'admin';
        } else if (user.email == PREMIUM_EMAIL && password === PREMIUM_PASSWORD) {
          console.log("Asignando rol de premium");
          user.rol = 'premium';
        } else {
          req.logger.info("Asignando rol de usuario");
          user.rol = 'user';
        }
        console.log("Rol después de la asignación:", user.rol);
        let result = await usersModel.create(user);
        console.log("Usuario después de guardar:", result);
        if (result) {
          return done(null, result);
        }
      } catch (error) {

        return done(error);
      }
    }
  )
  );

  passport.use("login", new LocalStrategy({ usernameField: "email", passwordField: "password" },
    async (username, password, done) => {
      try {
        let user = await usersModel.findOne({ email: username });
        if (!user) { return done(null, false, { message: "Usuario incorrecto." }); }
        if (!isValidPassword(user, password)) { return done(null, false, { message: "Contraseña incorrecta." }); }
        if (!user.cart) {
          const cart = await cartService.createCart();
          user.cart = cart._id;
          await userService.updateUser(username, user)
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      };
    }
  ));

  passport.use("jwt", new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: JWT_KEY,
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




