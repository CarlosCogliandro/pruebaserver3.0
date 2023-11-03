import { createHash } from "../middleware/bcrypt.js";
import UserService from "../services/user.service.js";
import UserResponse from "../dao/mongoDB/DTO/user.response.js";

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async register(req, res) {
    const { first_name, last_name, email, avatar, age, password, rol, admin, cart } = req.body;
    const response = await this.userService.register({
      first_name,
      last_name,
      email,
      avatar,
      age,
      password,
      rol,
      admin,
      cart
    });
    return res.status(response.status === "success" ? 200 : 400).json({
      status: response.status,
      data: response.user,
      redirect: response.redirect,
    });
  };

  async restorePassword(req, res) {
    const { user, password } = req.query;
    try {
      const passwordRestored = await this.userService.restorePassword(
        user,
        createHash(password)
      );
      if (passwordRestored) {
        return res.send({
          status: "OK",
          message: "La contraseña se ha actualizado correctamente!",
        });
      } else {
        return res.status(401).send({
          status: "Error",
          message: "No se pudo actualizar la contraseña!",
        });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    };
  };

  currentUser(req, res) {
    if (req.session.user) {
      return res.send({
        status: "OK",
        payload: new UserResponse(req.session.user),
      });
    } else {
      return res
        .status(401)
        .send({ status: "Error", message: "No authorized" });
    };
  };
};

export default UserController;
