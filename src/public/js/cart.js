// const createCart = async () => {
//   try {
//     if (localStorage.getItem("carrito")) {
//       return JSON.parse(localStorage.getItem("carrito"));
//     } else {
//       const response = await fetch("/api/carts/", {
//         method: "POST",
//         headers: { "Content-type": "application/json; charset=UTF-8" },
//       });
//       const data = await response.json();
//       console.log("Data del carrito:", data);
//       localStorage.setItem("carrito", JSON.stringify({ id: data.id }));
//       return { id: data.id };
//     }
//   } catch (error) {
//     console.log("Error en Crear el Carrito! " + error);
//   }
// };

const getCartID = async () => {
  try {
    const response = await fetch("/api/carts/usuario/carrito", {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      console.error("Error obteniendo el ID del carrito");
      return null;
    };
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.log("Error en obtener el Id del Carrito! ", error);
    return null;
  };
};

const addProductToCart = async (pid) => {
  try {
    const cid = await getCartID();
    if (!cid) {
      console.error("El ID del carrito es inválido.");
      return;
    }
    const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
    }).then(response => {
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Producto Agregado Correctamente",
          text: `Revisa tu carrito 🛒`
        });
        return res.json();
      } else {
        throw new Error('Something went wrong');
      }
    });
    if (!response.ok) {
      console.log("Error al agregar el producto al carrito");
      return;
    }
    console.log("Se agrego el producto al carrito");
  } catch (error) {
    console.log("Error en agregar el Producto al Carrito! " + error);
  };
};

async function getPurchase() {
  try {
    const cid = await getCartID();
    if (!cid) {
      console.error("Carrito no encontrado");
      return;
    }
    const response = await fetch(`/api/carts/${cid}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(response => {
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Compra realizada con exito",
          text: "Revisa tu Correo Electronico para ver el detalle de tu compra. Muchas gracias."
        });
        return res.json();
      } else {
        throw new Error('Failed to purchase cart.');
      }
    }).then(data => {
      console.log(data)
      const ticketCode = data.ticket._id;
      window.location.href = `/tickets/${ticketCode}`;
    })
    if (!response.ok) {
      console.error("Error al realizar la compra");
      return;
    }
    console.log("Compra realizada con éxito");
  } catch (error) {
    console.error("Error al realizar la compra", error);
  };
};

document.addEventListener("DOMContentLoaded", () => {
  const cartButton = document.getElementById("cartButton");
  if (cartButton) {
    cartButton.addEventListener("click", async () => {
      try {
        const cartId = await getCartID();
        if (cartId) {
          window.location.assign(`/carts/`);
        } else {
          console.error("El ID del carrito es undefined");
        }
      } catch (error) {
        console.error("Error al obtener el ID del carrito: " + error);
      }
      error.preventDefault();
    });
  };
});
