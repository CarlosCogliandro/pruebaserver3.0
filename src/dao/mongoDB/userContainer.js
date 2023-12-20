import { isValidPassword, createHash } from "../../middleware/bcrypt.js";
import usersModel from "./models/user.model.js";
import GetUserDTO from "../DTO/user.dto.js";
import mongoose from "mongoose";

class UserContainer {

  async register({ first_name, last_name, email, avatar, age, phone, address, password, rol, cart, last_connection }) {
    try {
      const existingUser = await usersModel.findOne({ email });
      if (existingUser) {
        console.log("User already exists");
        return null;
      }
      const hashedPassword = createHash(password);
      const user = await usersModel.create({
        _id: new mongoose.Types.ObjectId(),
        first_name,
        last_name,
        email,
        avatar,
        age,
        phone,
        address,
        password: hashedPassword,
        rol,
        cart,
        last_connection: new Date()
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
        const rol = userLogged.email === "carloscogliandro22@gmail.com" ? "admin" : "user";
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

  async getUsers() {
    return await usersModel.find().lean();
  };

  async findUser(user) {
    try {
      const searched = await usersModel.findOne({ email: user });
      if (searched) {
        const role =
          searched.email === "carloscogliandro22@gmail.com" ? "admin" : "user";
        return searched;
      }
      return null;
    } catch (error) {
      console.error("Error durante la busqueda:", error);
      throw error;
    };
  };

  async deleteUser(uid) {
    try {
      const user = await usersModel.findOne({ email: uid }).lean();
      console.log(email)
      console.log("//////DAO//////");
      console.log("UID");
      console.log(uid);
      console.log("user");
      console.log(user);
      await usersModel.deleteOne({ email: uid });
      const userDTO = new GetUserDTO(user);
      return userDTO;
    } catch (error) {
      console.warn(); (`Error deleting user: ${error}`);
    };
  };

  async searchLastConnection(days) {
    try {
      const usersLastConnection = await usersModel.findOne({ last_connection: { $lt: new Date(Date.now() - (days * 24 * 60 * 60 * 1000)) } });
      await usersModel.deleteMany({ last_connection: { $lt: new Date(Date.now() - (days * 24 * 60 * 60 * 1000)) } });
      const inactiveUsersDTO = usersLastConnection.map(user => new GetUserDTO(user));
      return inactiveUsersDTO;
    } catch (error) {
      console.error('Error al encontrar la ultima conexion:', error);
      return false;
    };
  };

  async updateUser(userId, userToReplace) {
    const filter = { email: userId }
    const update = { $set: userToReplace };
    const result = await usersModel.updateOne(filter, update);
    return result;
  };

  async getUserById(id) {
    try {
      return await userModel.findById(id).lean();
    } catch (error) {
      console.error("Error fetching product by id:", error);
      return null;
    };
  };

  async findOne(email) {
    const result = await usersModel.findOne({ email }).lean();
    return result;
  };

};

export default UserContainer;