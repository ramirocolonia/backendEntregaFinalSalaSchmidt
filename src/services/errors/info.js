// ERRORES GENERICOS
export const mongoError = () =>{
  return "error al conectar con mongoDB";
}

export const uniqueField = (key) =>{
  return  `El campo ${key} ya se encuentra registrado en la BDD.`;
}

export const unfindField = (key) =>{
  return `El campo ${key} no se encuentra registrado en la BDD.`;
}

// ERRORES DE USUARIO
export const generateUserErrorInfo = (user) =>{
  return  `Una o más propiedades estaban incompletas o no eran el formato.
          Lista de propiedades requeridas:
          * first_name: necesita un String, se recibió ${user.first_name}
          * last_name: necesita un String, se recibió un ${user.last_name}
          * email: necesita un String, se recibió un ${user.email}
          * age: necesita un Number, se recibió un ${user.age}
          * password: necesita un String, se recibió un ${user.password} 
          `;
}

// ERRORES DE PRODUCTO
export const generateProductErrorInfo = (product) =>{
  return  `Una o más propiedades estaban incompletas o no eran el formato.
          Lista de propiedades requeridas:
          * title: necesita un String, se recibió ${product.title}
          * description: necesita un String, se recibió un ${product.description}
          * code: necesita un String, se recibió un ${product.code}
          * price: necesita un Number, se recibió un ${product.price}
          * stock: necesita un Number, se recibió un ${product.stock}
          * category: necesita un String, se recibió un ${product.category} 
          `;
}

export const generateOwnerErrorInfo = (owner, user) =>{
  return  `El usuario logueado no es administrador o no es el dueño del producto que desea eliminar/modificar.
          Valores:
          * dueño del producto: ${owner}
          * usuario logueado: ${user}
          `;
}

// ERRORES DE CHAT
export const generateMessageErrorInfo = (message) =>{
  return  `Una o más propiedades estaban incompletas o no eran el formato.
          Lista de propiedades requeridas:
          * user: necesita un String, se recibió ${message.user}
          * message: necesita un String, se recibió un ${message.message}
          `;
}







