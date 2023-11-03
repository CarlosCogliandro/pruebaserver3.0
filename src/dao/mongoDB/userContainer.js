import { isValidPassword, createHash } from "../../middleware/bcrypt.js";
import usersModel from "./models/user.model.js";

class UserContainer {

  async register({ first_name, last_name, email, avatar, age, phone, address, password, rol }) {
    try {
      const existingUser = await usersModel.findOne({ email });
      if (existingUser) {
        console.log("User already exists");
        return null;
      }
      const hashedPassword = createHash(password);
      const user = await usersModel.create({
        first_name,
        last_name,
        email,
        avatar,
        age,
        phone,
        address,
        password: hashedPassword,
        rol,
      });
      console.log("User added!", user);
      return user;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    };
  };

  async login(user, pass) {
    try {
      const userLogged = await usersModel.findOne({ email: user });
      if (userLogged && isValidPassword(userLogged, pass)) {
        const rol = userLogged.email === "carloscogliandro22@gmail.com" ? "admin" : "usuario";
        return userLogged;
      }
      return null;
    } catch (error) {
      console.error("Error durante el login:", error);
      throw error;
    };
  };

  async restorePassword(email, hashedPassword) {
    try {
      const user = await usersModel.findOne({ email });
      if (!user) {
        console.log("Usuario no encontrado.");
        return false;
      };
      user.password = hashedPassword;
      await user.save();
      console.log("Contraseña restaurada correctamente.");
      return true;
    } catch (error) {
      console.error("Error restoring password:", error);
      return false;
    };
  };

  getBy = (params) => {
    return usersModel.findOne(params).lean();
  }
};



export default UserContainer;