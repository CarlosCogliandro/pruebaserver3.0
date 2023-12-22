import UserContainer from "../dao/mongoDB/userContainer.js";
import CartContainer from '../dao/mongoDB/cartContainer.js';
import { ADMIN_EMAIL, ADMIN_PASSWORD, PREMIUM_EMAIL, PREMIUM_PASSWORD, GET_INACTIVE_DAYS } from "../config/config.js";

class UserService {
  constructor() {
    this.userContainer = new UserContainer();
    this.cartContainer = new CartContainer()
  };

  async registerUser({ first_name, last_name, email, avatar, age, adress, phone, password, rol, last_connection }) {
    try {
      const cartResponse = await this.cartContainer.newCart();
      console.log("Cart response:", cartResponse);
      if (cartResponse.status !== "ok") {
        return { status: "error", message: "Error creating cart" };
      }
      const rol = email == ADMIN_EMAIL && password === ADMIN_PASSWORD ? "admin" : email == PREMIUM_EMAIL && password === PREMIUM_PASSWORD ? "premium" : "user";
      const cartId = cartResponse.id;
      console.log("Cart ID:", cartId);
      const user = await this.userContainer.register({
        first_name,
        last_name,
        email,
        avatar,
        age,
        adress,
        phone,
        password,
        rol,
        cart: cartId,
        last_connection,
      });
      if (user) {
        return { status: "success", user, redirect: "/login" };
      } else {
        return { status: "error", message: "User already exists" };
      }
    } catch (error) {
      console.error("Error registering user:", error);
      return { status: "error", message: "Internal Server Error" };
    };
  };

  async restorePassword(user, hashedPassword) {
    return await this.userContainer.restorePassword(user, hashedPassword);
  };

  async getAll() {
    const users = await this.userContainer.getUsers();
    return users;
  };

  async findOne(email) {
    try {
      const result = await this.userContainer.findUser(email);
      if (!email) {
        return result.status(401).json({ status: 'error', error: "No se pudo encontrar el usuario" });
      }
      return result;
    } catch (error) {
      console.log(error);
    };
  };

  async deleteUser(uid) {
    try {
      const userDeleted = await this.userContainer.deleteUser(uid);
      console.log("//////services//////");
      console.log("UID");
      console.log(uid);
      console.log("userDeleted");
      console.log(userDeleted);
      return userDeleted;
    } catch (error) {
      console.warn(`Error deleting the user: ${error.message}`);
      next(error);
    };
  };

  async updateUser(userId, userToReplace) {
    return await this.userContainer.updateUser(userId, userToReplace);
  };

  async getUserById(id) {
    return await this.userContainer.getUserById(id);
  };

  async swapUserRole(email) {
    if (!email) {
      return res.status(401).json({ status: 'error', error: "Email is required." });
    }
    try {
      let user = await this.userContainer.findOne(email);
      console.log(`Get user data from: ${email}`);
      if (!user) {
        return res.status(401).json({ status: 'error', error: "Can't find user." });
      }
      if (user.rol === "admin") {
        return res.status(403).json({ status: "error", message: "Admin users cant swap roles" });
      } else {
        // Check required documents por swap to Premium
        const requiredDocuments = [
          "identificationDocument",
          "domicileProofDocument",
          "accountStatementDocument"];
        const hasRequiredDocuments = requiredDocuments.every(document => {
          return user.documents.some(doc => doc.reference.includes(document) && doc.status === "Uploaded");
        });
        if (hasRequiredDocuments) {
          if (user.rol === "user") {
            user.rol = "premium";
            const changedRol = await this.userContainer.updateUser(email, user);
            return changedRol;
          } else if (user.rol === "premium") {
            user.rol = "user";
            const changedRol = await this.userContainer.updateUser(email, user);
            return changedRol;
          };
        } else {
          throw new Error('Something went wrong validating. Must have all 3 documents to swap role');
        }
      }
    } catch (error) {
      console.warn(`Error updating user role: ${error.message}`);
      next(error);
    }
  };
};

export default UserService;