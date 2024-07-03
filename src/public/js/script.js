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