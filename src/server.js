import express from "express";
import expressHandlebars from "express-handlebars";
import session from "express-session";
import Handlebars from "handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import mongoose from "mongoose";

import cartsRouter from "./routes/cart.router.js";
import productsRouter from "./routes/product.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import viewsRouter from "./routes/views.router.js";
import emailRouter from './routes/email.router.js';

import initializePassport from "./middleware/login.passport.js"
import initializeStrategiesGithubGoogle from "./middleware/login.github.google.js";
import passport from "passport";

import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors"
import { MONGO_URL, PORT, SESSION_SECRET } from "./config/config.js"
import { addLogger, levels } from './middleware/logger.js';

import productContainer from "./dao/mongoDB/productContainer.js";
import messagesContainer from "./dao/mongoDB/messagesContainer.js";

const app = express();

//Mongo connect
const connection = mongoose.connect(MONGO_URL, ({
  useNewUrlParser: true,
  useUnifiedTopology: true
}));

// Connect to Server
const httpServer = app.listen(PORT, () => { console.log(`Conectado a http://localhost:${PORT}`) });
httpServer.on('Error al conectar ----->', (error) => { console.log(error) });

export const socketServer = new Server(httpServer);

// Middlewares
app.use(express.static(__dirname));
app.use(express.static(__dirname + "/public"));
app.use("/images", express.static(__dirname + "/public/images"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(session({
  store: new MongoStore({
    mongoUrl: MONGO_URL,
    ttl: 3600,
    collectionName: "sessions"
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(cors({
  credentials: true,
  method: ["GET", "POST", "PUT", "DELETE"]
}));

// Passport
initializeStrategiesGithubGoogle();
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Engine
app.engine("handlebars", expressHandlebars.engine({ handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// App Use - LOGGER 
app.use(addLogger);
app.get('/peticion', (req, res) => { res.send(`Petición atendida por ${process.pid}`); });

// Routers
app.use("/", viewsRouter);
app.use("/api/sessions/", sessionsRouter);
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use('/api/email/', emailRouter);
app.use('/logger', (req, res) => {
  levels,
  req.logger.warn('Log de alerta')
  req.send('Prueba de Logger')
})

// Containers
const PC = new productContainer();
const MC = new messagesContainer();

//Socket
app.set("socketServer", socketServer);

socketServer.on("connection", async (socket) => {
  console.log("Un cliente se ha conectado");
  const allProducts = await PC.getProducts();
  socket.emit("initial_products", allProducts);
  socket.on("createProduct", async (obj) => {
    await PC.createProduct(obj);
    const listadeproductos = await PC.getProductsViews();
    socketServer.emit("envioDeProductos", listadeproductos);
  });

  socket.on("deleteProduct", async (id) => {
    console.log(id);
    const listadeproductos = await PC.getProductsViews();
    await PC.deleteProduct(id);
    socketServer.emit("envioDeProducts", listadeproductos);
  });

  socket.on("eliminarProducto", (data) => {
    PC.deleteProduct(parseInt(data));
    const listadeproductos = PC.getProducts();
    socketServer.emit("envioDeProducts", listadeproductos);
  });

  socket.on("nuevoUsuario", (usuario) => {
    console.log("usuario", usuario);
    socket.broadcast.emit("broadcast", usuario);
  });

  socket.on("disconnet", () => { console.log("Usuario desconectado"); });

  socket.on("mensaje", async (info) => {
    console.log(info);
    await MC.createMessage(info);
    socketServer.emit("chat", await MC.getMessages());
  });
});