import ProductContainer from "../dao/mongoDB/productContainer.js";

class ProductService {
  constructor() {
    this.productContainer = new ProductContainer();
  };

  async createProduct(product) {
    if (await this.productContainer.validateCode(product.code)) {
      console.log("Error! Code exists!");
      return null;
    }
    return await this.productContainer.createProduct(product);
  };

  async getProducts(params) {
    return await this.productContainer.getProducts(params);
  };

  async getProductById(id) {
    return await this.productContainer.getProductById(id);
  };

  async updateProduct(id, product) {
    return await this.productContainer.updateProduct(id, product);
  };

  async deleteProduct(id) {
    return await this.productContainer.deleteProduct(id);
  };
};

export default ProductService;