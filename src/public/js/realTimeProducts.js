// const socketClient = io();

// socketClient.on("envioDeProductos", (obj) => {
//     updateProductList(obj);
// });

// function updateProductList(products) {
//     let div = document.getElementById("list-products");
//     let productos = " ";
//     products.forEach((product) => {
//         productos += `<article>
//                      <div class="card mb-3">
//                      <div class="imgBx">
//                      <img src="${product.thumbnail}" width="150"/>
//                      </div>
//                      <div class="contentBx">
//                      <h2>${product.title}</h2>
//                      <div class="color">
//                      <h3>$${product.price}</h3>
//                      </div>
//                      <a href="#">Comprar ahora</a>
//                      </div>
//                      </div>
//                      </article>`;
//     });
//     div.innerHTML = productos;
// };

// let form = document.getElementById("formProduct");
// form.addEventListener("submit", (evt) => {
//     evt.preventDefault();
//     let title = form.elements.title.value;
//     let description = form.elements.description.value;
//     let stock = form.elements.stock.value;
//     let thumbnail = form.elements.thumbnail.value;
//     let category = form.elements.category.value;
//     let price = form.elements.price.value;
//     let code = form.elements.code.value;
//     socketClient.emit("addProduct", {
//         title,
//         description,
//         stock,
//         thumbnail,
//         category,
//         price,
//         code,
//     });
//     form.reset();
// });

// document.getElementById("delete-btn").addEventListener("click", function () {
//     const deleteidinput = document.getElementById("id-prod");
//     const deleted = deleteidinput.value;
//     socketClient.emit("deleteProduct", deleted);
//     deleteidinput.value = "";
// });

// const deleteProduct = () => {
//     const idProd = document.getElementById("id-prod").value;
//     socketClient.emit("eliminarProducto", idProd);
// };

// const btnEliminarProd = document.getElementById("btnEliminarProducto");
// btnEliminarProd.onclick = deleteProduct();


const socket = io();

socket.on("initial_products", function (products) {
  products.forEach((product) => {
    displayProduct(product);
  });
});

function displayProduct(newProduct) {
  var productElement = document.createElement("li");
  productElement.id = "product-" + newProduct._id;
  productElement.className = "product";
  var imageElement = document.createElement("img");
  imageElement.src = newProduct.thumbnail;
  imageElement.alt = newProduct.title;
  productElement.appendChild(imageElement);
  var textElement = document.createElement("span");
  textElement.textContent = "Producto: " + newProduct.title + " - Stock: " + newProduct.stock + " - Descripción: " + newProduct.description;
  productElement.appendChild(textElement);
  document.getElementById("productList").appendChild(productElement);
  var deleteButton = document.createElement("button");
  deleteButton.textContent = "Eliminar";
  deleteButton.className = "delete-button";
  deleteButton.dataset.id = newProduct._id;
  productElement.appendChild(deleteButton);
  var editButton = document.createElement("button");
  editButton.textContent = "Editar";
  editButton.className = "edit-button";
  editButton.dataset.id = newProduct._id;
  productElement.appendChild(editButton);
}

socket.on("product_created", function (newProduct) {
  console.log("Nuevo producto:", newProduct);
  displayProduct(newProduct);
});

socket.on("product_deleted", function (data) {
  console.log("Producto eliminado:", data._id);
  var productElement = document.getElementById("product-" + data._id);
  if (productElement) {
    productElement.remove();
  } else {
    console.log("Error: Producto no encontrado en el DOM.");
  }
});

document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const code = document.getElementById("code").value;
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;
  const category = document.getElementById("category").value;
  const thumbnail = document.getElementById("thumbnail").value;
  const productId = document.getElementById("productId").value;
  let url = "/api/products/";
  let method = "POST";
  if (productId) {
    url += productId;
    method = "PUT";
  }
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail,
      }),
    });
    if (response.ok) {
      const result = await response.json();
      console.log(result);
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-button")) {
    const id = e.target.dataset.id;
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("Producto eliminado:", id);
        socket.emit("delete_product", { id });
      } else {
        console.error("Error eliminando el producto:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  } else if (e.target.classList.contains("edit-button")) {
    const id = e.target.dataset.id;
    const response = await fetch(`/api/products/${id}`);
    const product = await response.json();
    for (const key in product) {
      if (document.getElementById(key)) {
        document.getElementById(key).value = product[key];
      }
    }
    document.getElementById('productId').value = product._id;
    document.querySelector('button[type="submit"]').textContent = 'Actualizar Producto';
  }
});