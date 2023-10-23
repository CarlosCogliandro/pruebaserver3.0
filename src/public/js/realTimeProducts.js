const socketClient = io();

socketClient.on("envioDeProductos", (obj) => {
    updateProductList(obj);
});

function updateProductList(products) {
    let div = document.getElementById("list-products");
    let productos = " ";
    products.forEach((product) => {
        productos += `<article>
                     <div class="card mb-3">
                     <div class="imgBx">
                     <img src="${product.thumbnail}" width="150"/>
                     </div>
                     <div class="contentBx">
                     <h2>${product.title}</h2>
                     <div class="color">
                     <h3>$${product.price}</h3>
                     </div>
                     <a href="#">Comprar ahora</a>
                     </div>
                     </div>
                     </article>`;
    });
    div.innerHTML = productos;
};

let form = document.getElementById("formProduct");
form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    let title = form.elements.title.value;
    let description = form.elements.description.value;
    let stock = form.elements.stock.value;
    let thumbnail = form.elements.thumbnail.value;
    let category = form.elements.category.value;
    let price = form.elements.price.value;
    let code = form.elements.code.value;
    socketClient.emit("addProduct", {
        title,
        description,
        stock,
        thumbnail,
        category,
        price,
        code,
    });
    form.reset();
});

document.getElementById("delete-btn").addEventListener("click", function () {
    const deleteidinput = document.getElementById("id-prod");
    const deleted = deleteidinput.value;
    socketClient.emit("deleteProduct", deleted);
    deleteidinput.value = "";
});

const deleteProduct = () => {
    const idProd = document.getElementById("id-prod").value;
    socketClient.emit("eliminarProducto", idProd);
};

const btnEliminarProd = document.getElementById("btnEliminarProducto");
btnEliminarProd.onclick = deleteProduct();

