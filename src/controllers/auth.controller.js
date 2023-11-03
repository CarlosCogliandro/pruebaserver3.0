import AuthService from "../services/auth.service.js";

class AuthController {
  constructor() {
    this.authService = new AuthService();
  };

  async login(req, res) {
    const { email, password } = req.body;
    const userData = await this.authService.login(email, password);
    if (!userData || !userData.user) {
      console.log("Invalid credentials");
      return res
        .status(401)
        .json({ status: "error", message: "Invalid credentials" });
    }
    if (userData && userData.user) {
      req.session.user = {
        id: userData.user.id || userData.user._id,
        email: userData.user.email,
        first_name: userData.user.first_name,
        last_name: userData.user.last_name,
        age: userData.user.age,
        rol: userData.user.rol,
        admin: userData.user.admin,
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
    console.log("Inside AuthController githubCallback");
    try {
      if (req.user) {
        req.session.user = req.user;
        req.session.loggedIn = true;
        return res.redirect("/");
      } else {
        return res.redirect("/login");
      };
    } catch (error) {
      console.error("An error occurred:", error);
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
      console.error("An error occurred:", error);
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
};

export default AuthController;