import ProductContainer from "../dao/mongoDB/productContainer.js";
import CartServices from "../services/cart.service.js";
import ticketController from "./ticket.controller.js";
import { v4 as uuidv4 } from "uuid";
import { transporter } from "./email.controller.js";
import { GMAIL_ACCOUNT_NODEMAILER } from "../config/config.js";

class CartController {
  constructor() {
    this.cartService = new CartServices();
    this.productContainer = new ProductContainer();
  }

  async createCart(req, res) {
    try {
      const newCart = await this.cartService.createCart();
      res.status(201).json({
        status: "success",
        message: "El carrito creado correctamente",
        cartId: newCart._id,
        payload: newCart,
      });
      console.log("Carrito creado: ", newCart)
    } catch (error) {
      res.status(500).send({
        status: "error",
        message: error.message,
      });
      console.log("Error al crear el carrito: ", error)
    };
  };

  async getCart(req, res) {
    try {
      const cart = await this.cartService.getCart(req.params.cid);
      res.json({
        status: "success",
        cart: cart,
      });
      console.log("Carrito obtenido: ", cart)
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
      console.log("Error al obtener el carrito: ", error)
    };
  };

  async getCartByID(cartId) {
    try {
      const cart = await this.cartService.getCart(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado")
      }
      return cart;
    } catch (error) {
      console.error('Error obteniendo el carrito', cart);
      throw error;
    }
  }

  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const result = await this.cartService.addProductToCart(cid, pid);
      res.send(result);
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    };
  };

  async updateQuantityProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const result = await this.cartService.updateQuantityProductFromCart(
        cid,
        pid,
        quantity
      );
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    };
  };

  async updateCart(req, res) {
    try {
      const cid = req.params.cid;
      const products = req.body.products;
      await this.cartService.updateCart(cid, products);
      res.send({
        status: "ok",
        message: "El producto se agregó correctamente!",
      });
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    };
  };

  async deleteProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const result = await this.cartService.deleteProductFromCart(cid, pid);
      res.send(result);
    } catch (error) {
      console.error(error);
    };
  };

  async deleteProductsFromCart(req, res) {
    try {
      const cid = req.params.cid;
      const result = await this.cartService.deleteProductsFromCart(cid);
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    };
  };

  async createPurchaseTicket(cartId, userEmail) {
    try {
      const cart = await this.cartService.getCart(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado")
      }
      console.log("Productos en el carrito:", cart.products);
      const failedProducts = [];
      const successfulProducts = [];
      for (const item of cart.products) {
        const product = await this.productContainer.getProductById(item.product);
        if (!product) {
          console.error(`Producto ${item.product} no encontrado`);
          failedProducts.push(item);
          continue;
        }
        if (product.stock < item.quantity) {
          console.log(`Stock insuficiente para el producto ${JSON.stringify(item.product)}`);
          failedProducts.push(item);
        } else {
          successfulProducts.push(item);
          const newStock = product.stock - item.quantity;
          await this.productContainer.updateProduct(item.product, { stock: newStock });
        }
      }
      if (successfulProducts.length === 0) {
        throw new Error("No se pudo comprar ningun producto")
      }
      const totalAmount = successfulProducts.reduce((total, item) => {
        const precioDelProducto = item.product.price;
        const cantidadP = item.quantity;
        if (typeof precioDelProducto !== "number" || typeof cantidadP !== "number") {
          console.error("Error en cantidad o precio para: ", item.product);
          return total;
        }
        return total + precioDelProducto * cantidadP;
      }, 0);
      if (isNaN(totalAmount)) {
        throw new Error("Error al calcular el monto total")
      }
      const ticketData = {
        code: uuidv4(),
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: userEmail,
      };
      const ticketCreated = await ticketController.createTicket(ticketData);
      const ticketCode = ticketData.code;
      console.log(ticketCode);
      const ticketOwner = ticketData.purchaser;
      console.log(ticketOwner);
      if (ticketCode) {
        console.log("Enviando aviso a owner: ", ticketOwner);
        const email = ticketOwner;
        const result = transporter.sendMail({
          from: GMAIL_ACCOUNT_NODEMAILER,
          to: email,
          subject: `Tuyen te agradece tu compra, aqui te enviamos el ticket`,
          html: `<div style="display: flex; flex-direction: column; justify-content: center;  align-items: center;">
          Hola gracias por confiar en Nosotros!
          <br>
          <br>
          Te traemos los datos de tu ticket de compra: <br> <br>
          Monto:\n${ticketData.amount}\n <br> <br>
          Codigo del ticket:\n${ticketData.code}\n <br> <br>
          Hora de la compra:\n${ticketData.purchase_datetime}\n <br> <br>
          Saludos y gracias nuevamente.
          </div>`,
        });
      }
      await this.deleteProductFromCart(cartId);
      return { success: true, ticketId: ticketCreated._id };
    } catch (error) {
      console.error("Error específico al crear el ticket de compra:", error);
      throw new Error("Error al crear el ticket de compra");
    }
  }

  async getPurchase(req, res) {
    try {
      const cid = req.params.cid;
      const purchase = await this.cartService.getCart(cid);
      if (purchase) {
        res.json({ status: "success", data: purchase });
      } else {
        res
          .status(404)
          .json({ status: "error", message: "Compra no encontrada" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: "error", message: "Error interno del servidor" });
    };
  };
};

export default new CartController();