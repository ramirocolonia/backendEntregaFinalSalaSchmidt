async function updateRol(uId) {
  const response = await fetch(`/api/users/premium/${uId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
  });
  if(response.status === 200){
    alert("Rol de usuario modificado correctamente");
    location.reload();
  }else{
    alert("error al modificar usuario")
  }
}

async function deleteUser(uId) {
  const response = await fetch(`/api/users/${uId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
  });
  if(response.status === 200){
    alert("Usuario eliminado correctamente");
    location.reload();
  }else{
    alert("error al eliminar usuario")
  }
}

async function addToCart(pid, cid) {
  const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
  });
  if(response.status === 200){
    alert(`Producto agregado al carrito correctamente`);
    location.reload();
  }else{
    alert("error al agregar producto")
  }
}

async function removeProductFromCart(pid, cid){
  const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
  });
  if(response.status === 200){
    alert("Producto eliminado del carrito correctamente");
    location.reload();
  }else{
    alert("error al eliminar producto del carrito")
  }
}

async function removeAllProductsFromCart(cid){
  const response = await fetch(`/api/carts/${cid}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
  });
  if(response.status === 200){
    alert("Todos los productos eliminados del carrito correctamente");
    location.reload();
  }else{
    alert("error al eliminar los productos del carrito")
  }
}

async function createOrder (cid){
  const response = await fetch(`/api/carts/${cid}/purchase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
  });
  if(response.status === 200){
    alert("Oden creada correctamente");
    location.reload();
  }else{
    alert("error al eliminar los productos del carrito")
  }
}