import UserContainer from "../dao/mongoDB/userContainer.js";
import CartContainer from '../dao/mongoDB/cartContainer.js'

class UserService {
  constructor() {
    this.userContainer = new UserContainer();
    this.cartContainer = new CartContainer()
  }
  
  async register({ first_name, last_name, email, avatar, age, phone, address, password, rol }) {
    try {
      const rol = email === "carloscogliandro22@gmail.com" ? "admin" : "user";
      const cart = this.cartContainer.newCart();
      const user = await this.userContainer.register({
        first_name,
        last_name,
        email,
        avatar,
        age,
        phone,
        address,
        password,
        rol,
        admin,
        cart
      });
      if (user) {
        return { status: "success", user, redirect: "/login" };
      } else {
        return { status: "error", message: "User already exists" };
      }
    } catch (error) {
      return { status: "error", message: "Internal Server Error" };
    };
  };

  async restorePassword(user, hashP) {
    const clave = await this.userContainer.restorePassword(user, hashP)
    if (clave) {
      return { status: "success", clave, redirect: "/profile" };
    };
  };
};

export default UserService;