import CartContainer from "../dao/mongoDB/cartContainer.js";

class CartService {
  constructor() {
    this.cartContainer = new CartContainer();
  };

  async createCart() {
    return await this.cartContainer.newCart();
  };

  async getCart(id) {
    return await this.cartContainer.getCart(id);
  };

  async addProductToCart(cid, pid) {
    const result = await this.cartContainer.addProductToCart(cid, pid);
    if (result) {
      return { status: "ok", message: "El producto se agregó correctamente!" };
    } else {
      throw new Error("Error! No se pudo agregar el Producto al Carrito!");
    };
  };

  async updateQuantityProductFromCart(cartId, productId, quantity) {
    const result = await this.cartContainer.updateQuantityProductFromCart(
      cartId,
      productId,
      quantity
    );
    if (result) {
      return {
        status: "ok",
        message: "El producto se actualizó correctamente",
      };
    } else {
      throw new Error("Error: No se pudo actualizar el producto del carrito");
    };
  };

  async deleteProductFromCart(cartId, productId) {
    const result = await this.cartContainer.deleteProductFromCart(
      cartId,
      productId
    );
    if (result) {
      return { status: "ok", message: "El producto se eliminó correctamente" };
    } else {
      throw new Error("Error: No se pudo eliminar el producto del carrito");
    };
  };

  async deleteCart(cartId) {
    const result = await this.cartContainer.deleteProductFromCart(cid, pid);
    if (result) {
      res.send({
        status: "ok",
        message: "El producto se eliminó correctamente",
      });
    } else {
      res.status(400).send({
        status: "error",
        message: "Error: No se pudo eliminar el producto del carrito",
      });
    }
    return await this.cartContainer.deleteProductFromCart(cid, pid);
  };

  async updateCart(cartId, products) {
    const result = await this.cartContainer.updateProducts(cartId, products);
    if (result) {
      return { status: "ok", message: "El carrito se actualizó correctamente" };
    } else {
      throw new Error("Error: No se pudo actualizar el carrito");
    };
  };

  async deleteProductsFromCart(cartId) {
    const result = await this.cartContainer.deleteProductsFromCart(cartId);
    if (result) {
      return { status: "ok", message: "El carrito se vació correctamente!" };
    } else {
      throw new Error('Error! No se pudo vaciar el Carrito!');
    };
  };
};

export default CartService;