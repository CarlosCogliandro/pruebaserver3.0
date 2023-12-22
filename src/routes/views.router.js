import express from "express";
import ProductContainer from "../dao/mongoDB/productContainer.js";
import CartContainer from "../dao/mongoDB/cartContainer.js";
import cartController from "../controllers/cart.controller.js";
import usersModel from "../dao/mongoDB/models/user.model.js";
import { passportCall, authorization } from "../middleware/passAuth.js";
import UserController from "../controllers/user.controller.js";
import TicketController from "../controllers/ticket.controller.js";

const router = express.Router();
const PC = new ProductContainer();
const CC = new CartContainer()
const userController = new UserController();

const checkSession = (req, res, next) => {
  console.log('Checking session:', req.session);
  if (req.session && req.session.user) {
    console.log('Session exists:', req.session.user);
    next();
  } else {
    console.log('No session found, redirecting to /login');
    res.redirect("/login");
  };
};

const checkAlreadyLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    console.log("Usuario ya autenticado, redirigiendo a /profile");
    res.redirect("/profile");
  } else {
    console.log("Usuario no autenticado, procediendo...");
    next();
  }
};

async function loadUserCart(req, res, next) {
  if (req.session && req.session.user) {
    const cartId = req.session.user.cart;
    console.log('Cart ID:', cartId);
    const cart = await CC.getCart(cartId);
    console.log('Cart:', cart);
    req.cart = cart;
  }
  next();
}

// Routes!!

router.get("/", checkSession, async (req, res) => {
  const products = await PC.getProducts(req.query);
  res.render("home", { products });
});

router.get("/products", checkSession, async (req, res) => {
  const products = await PC.getProducts(req.query);
  const user = req.session.user;
  console.log(user);
  res.render("products", { products, user });
});

router.get("/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  const product = await PC.getProductById(pid);
  if (product) {
    res.render("productDetail", { product });
  } else {
    res.status(404).send({ status: "error", message: "Product not found." });
  }
});

router.get("/carts", loadUserCart, async (req, res) => {
  const cart = req.cart;
  if (cart) {
    console.log(JSON.stringify(cart, null, 4));
    res.render("cart", { products: cart.products });
  } else {
    res.status(400).send({
      status: "error",
      message: "Error! No se encuentra el ID de Carrito!",
    });
  }
});

router.post("/carts/:cid/purchase", async (req, res) => {
  const cid = req.params.cid;
  cartController.getPurchase(req, res, cid);
});

router.get("/tickets/:code", async (req, res) => {
  const code = req.params.code;
  cartController.getPurchase(req, res, code);
});

router.get("/realtimeproducts", (req, res) => { res.render("realTimeProducts") });

router.get("/chat", (req, res) => { res.render("chat") });

router.get("/login", checkAlreadyLoggedIn, (req, res) => { res.render("login") });

router.get("/register", checkAlreadyLoggedIn, (req, res) => { res.render("register") });

router.get("/profile", checkSession, (req, res) => {
  console.log('Inside /profile route');
  const userData = req.session.user;
  console.log('User data:', userData);
  res.render("profile", { user: userData, userId: userData.id });
});

router.get("/changepass", (req, res) => { res.render("changePass") });

router.get("/restore", async (req, res) => { res.render("restore"); });

router.get("/upload/:uid", (req, res) => {
  const userId = req.params.uid;
  console.log("ID de usuario: ", userId);
  res.render("uploads", { userId });
});

router.get('/premium/:uid', (req, res) => {
  const userId = req.params.uid;
  console.log("ID de usuario: ", userId);
  res.render("premium", { userId });
});

router.get("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const user = await usersModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) { return res.redirect("/restore"); }
  res.render('reset-password', { token });
});

router.get("/faillogin", (req, res) => {
  res.status(401).json({
    status: "error",
    message: "Login failed. Invalid username or password.",
  });
});

router.get("/failregister", async (req, res) => {
  res.send({
    status: "Error",
    message: "Error! No se pudo registar el Usuario!",
  });
});

router.get("/usermanagment", passportCall("jwt"), authorization(['admin']), userController.getUserManagment.bind(userController));

router.get("/ticket-detail/:ticketId", async (req, res) => {
  const ticketId = req.params.ticketId;
  try {
    const ticket = await TicketController.getTicketDetail(ticketId);
    if (ticket) {
      res.render("ticketDetail", { ticket });
    } else {
      res.status(404).send("No se ha encontrado el ticket");
    };
  } catch (error) {
    console.error("Error al traer el ticket: ", error);
    res.status(500).send("Error interno");
  };
});

export default router;
