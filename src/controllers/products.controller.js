import ProductsServices from "../services/products.service.js";
import { socketServer } from "../server.js";
import mongoose from "mongoose";
import CustomeError from "../services/errors/customeError.js";
import { productError } from "../services/errors/errorMessages/product.error.js";

class ProductController {
  constructor() {
    this.productService = new ProductsServices();
  };

  async createProduct(req, res) {
    let { title, description, code, price, status, stock, category, thumbnail, } = req.body;
    const owner = req.user_id;
    if (!title) {
      res.status(400).send({ status: "error", message: "Error no se cargo el campo Titulo" })
    };
    if (!description) {
      res.status(400).send({ status: "error", message: "Error no se cargo el campo Description" })
    };
    if (!code) {
      res.status(400).send({ status: "error", message: "Error no se cargo el campo Codigo" })
    };
    if (!price) {
      res.status(400).send({ status: "error", message: "Error no se cargo el campo Price" })
    };
    status = !status && true;
    if (!stock) {
      res.status(400).send({ status: "error", message: "Error no se cargo el campo Stock" })
    };
    if (!category) {
      res.status(400).send({ status: "error", message: "Error no se cargo el campo Category" })
    };
    if (!thumbnail) {
      res.status(400).send({ status: "error", message: "Error no se cargo el campo Thumbnail" })
    };
    try {
      const wasAdded = await this.productService.createProduct({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail: `${req.protocol}://${req.hostname}:${process.env.PORT}/images/${file.filename}`,
        owner,
      });
      if (wasAdded && wasAdded._id) {
        res.send({
          status: "ok",
          message: "El Producto se agregó correctamente!",
          productId: wasAdded._id,
        });
        socketServer.emit("product_created", { _id: wasAdded._id, title, description, code, price, status, stock, category, thumbnail, owner, });
        return;
      } else {
        console.log("Error al añadir producto, wasAdded:", wasAdded);
        res.status(500).send({
          status: "error",
          message: "Error! No se pudo agregar el Producto!",
        });
        return;
      }
    } catch (error) {
      console.error("Error en addProduct:", error, "Stack:", error.stack);
      res
        .status(500)
        .send({ status: "error", message: "Internal server error." });
      return;
    };
  };

  async getProducts(req, res) {
    try {
      const products = await this.productService.getProducts(req.query);
      res.send(products);
    } catch (error) {
      const productErr = new CustomeError({
        name: "Product Fetch Error",
        message: "Error al obtener los productos",
        code: 500,
        cause: error.message,
      });
      req.logger.error(productErr);
      res.status(productErr.code).send({ status: "error", message: "Error al obtener los productos" })
    }
  }

  async getProductById(req, res) {
    try {
      const pid = req.params.pid;
      if (!mongoose.Types.ObjectId.isValid(pid)) {
        throw new CustomeError({
          name: "Invalid ID",
          message: "El ID no es correcto",
          code: 400,
          cause: productError(pid),
        });
      };
      const product = await this.productService.getProductById(pid);
      if (!product) {
        throw new CustomeError({
          name: "Product not found",
          message: "El producto no pudo ser encontrado",
          code: 404,
        });
      };
      res.status(200).json({ status: "success", data: product });
      return;
    } catch (error) {
      next(error)
    };
  };

  async updateProduct(req, res) {
    try {
      const { title, description, code, price, status, stock, category, thumbnail } = req.body;
      const pid = req.params.pid;
      const wasUpdated = await this.productService.updateProduct(pid, {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      });
      if (wasUpdated) {
        res.send({
          status: "ok",
          message: "El Producto se actualizó correctamente!",
        });
        socketServer.emit("product_updated");
      } else {
        res.status(500).send({
          status: "error",
          message: "Error! No se pudo actualizar el Producto!",
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ status: "error", message: "Internal server error." });
    };
  };

  async deleteProduct(req, res) {
    try {
      const pid = req.params.pid;
      if (!mongoose.Types.ObjectId.isValid(pid)) {
        console.log("ID del producto no válido");
        res.status(400).send({
          status: "error",
          message: "ID del producto no válido",
        });
        return;
      }
      const product = await this.productService.getProductById(pid);
      if (!product) {
        console.log("Producto no encontrado");
        res.status(404).send({
          status: "error",
          message: "Producto no encontrado",
        });
        return;
      }
      if (!req.user || (req.user.role !== "admin" && (!product.owner || req.user._id.toString() !== product.owner.toString()))) {
        console.log("Operación no permitida: el usuario no tiene derechos para eliminar este producto.");
        res.status(403).send({
          status: "error",
          message: "No tiene permiso para eliminar este producto.",
        });
        return;
      };
      const wasDeleted = await this.productService.deleteProduct(pid);
      if (wasDeleted) {
        console.log("Producto eliminado exitosamente");
        res.send({
          status: "ok",
          message: "Producto eliminado exitosamente",
        });
        socketServer.emit("product_deleted", { _id: pid });
      } else {
        console.log("Error eliminando el producto");
        res.status(500).send({
          status: "error",
          message: "Error eliminando el producto",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        status: "error",
        message: "Error interno del servidor",
      });
    };
  };
};

export default new ProductController();