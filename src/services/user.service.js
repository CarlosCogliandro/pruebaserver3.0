import UserContainer from "../dao/mongoDB/userContainer.js";

class UserService {
  constructor() {
    this.userContainer = new UserContainer();
  }
  
  async register({ first_name, last_name, email, avatar, age, phone, address, password, rol }) {
    try {
      const rol = email === "adminCoder@coder.com" ? "admin" : "user";
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

  async restorePassword(user, hashP) {
    const clave = await this.userContainer.restorePassword(user, hashP)
    if (clave) {
      return { status: "success", clave, redirect: "/profile" };
    };
  };
};

export default UserService;