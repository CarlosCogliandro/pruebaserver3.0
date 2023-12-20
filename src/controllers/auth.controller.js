import AuthService from "../services/auth.service.js";
import { createHash, isValidPassword } from "../middleware/bcrypt.js";
import userModel from "../dao/mongoDB/models/user.model.js";
import sendResetPasswordEmail from "./resetPasswordController.js";
import CustomeError from "../services/errors/customeError.js";
import { generateAuthenticationErrorInfo } from "../services/errors/errorMessages/user-auth-error.js";


class AuthController {
  constructor() {
    this.authService = new AuthService();
  };

  async login(req, res) {
    const { email, password } = req.body;
    const userData = await this.authService.login(email, password);
    userData.user.last_connection = new Date();
    await userData.user.save();
    if (!userData || !userData.user) {
      const customeError = new CustomeError({
        name: "Auth Error",
        message: "Credenciales invalidas",
        code: 401,
        cause: generateAuthenticationErrorInfo(email),
      });
      return next(customeError)
    }
    if (userData && userData.user) {
      req.session.user = {
        id: userData.user.id || userData.user._id,
        email: userData.user.email,
        first_name: userData.user.first_name,
        last_name: userData.user.last_name,
        age: userData.user.age,
        rol: userData.user.rol,
        cart: userData.user.cart
      };
    }
    res.cookie("coderCookieToken", userData.token, {
      httpOnly: true,
      secure: false,
    });
    return res
      .status(200)
      .json({ status: "success", user: userData.user, redirect: "/" });
  };

  async githubCallback(req, res) {
    try {
      if (req.user) {
        req.session.user = req.user;
        req.session.loggedIn = true;
        return res.redirect("/");
      } else {
        return res.redirect("/login");
      };
    } catch (error) {
      return res.redirect("/login");
    };
  };

  async googleCallback(req, res) {
    try {
      if (req.user) {
        req.session.user = {
          id: user._id,
          email: user.email,
          rol: user.rol
        };
        return res.redirect("/");
      } else {
        return res.redirect("/login");
      };
    } catch (error) {
      return res.redirect("/login");
    };
  };

  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect("/profile");
      }
      return res.redirect("/login");
    });
  };

  async restorePassword(req, res) {
    const { email } = req.body;
    try {
      await sendResetPasswordEmail(email);
      return res.redirect("/changepass")
    } catch (error) {
      console.error("Error in sendResetPasswordEmail:", error);
      res.status(500).send("Hubo un error al procesar tu solicitud de restablecimiento de contraseña. " + error.message);
    }
  }

  async resetPassword(req, res) {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).send("Las contraseñas no coinciden.");
    }
    try {
      const user = await userModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(400).json({
          message: "El token de restablecimiento de contraseña es inválido o ha expirado.",
          tokenExpired: true,
        });
      }
      const isSamePassword = isValidPassword(user, password);
      if (isSamePassword) {
        return res
          .status(400)
          .send("La nueva contraseña debe ser diferente a la contraseña actual.");
      }
      user.password = createHash(password);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      res.send("Tu contraseña ha sido actualizada con éxito.");
    } catch (error) {
      console.error("Error al resetear la contraseña:", error);
      res
        .status(500)
        .send("Error interno del servidor al intentar actualizar la contraseña.");
    }
  }
};

export default AuthController;