import multer from "multer";
import UserDTO from "../dao/DTOs/user.dto.js";
import { upload } from "../multer.js";
import { userService } from "../repositories/index.js";
import { tr } from "@faker-js/faker";

class UserController {
  updateUserRol = async (req, res) => {
    const uid = req.params.uid;
    const user = await userService.findOneUser({_id: uid});

    if (user.rol === "ADMIN") {
      res.send({
        status: "error",
        message: "Error, el usuario seleccionado es Administrador",
      });
    } else {
      let rolChange = false;
      if (user.rol === "PREMIUM") {
        user.rol = "USER";
        rolChange = true;
      } else {
        // chequeo que haya subido los documentos:
        // identificación (ID), comprobante domicilio (ADDRESS) Y comprobante estado de cuenta (ACCOUNTSTATEMENT)
        let haveID = false, haveAddress = false, haveAccountStatement = false;
        user.documents.map((doc) =>{
          if(doc.name === "ID"){
            haveID = true;
          }else if(doc.name === "ADDRESS"){
            haveAddress = true;
          }else if(doc.name === "ACCOUNTSTATEMENT"){
            haveAccountStatement = true;
          }
        });
        if(haveAccountStatement && haveAddress && haveAddress){
          user.rol = "PREMIUM";
          rolChange = true;
        }else{
          res.status(403).send({ status: "error", message: "Error, le faltan subir documentos" });
        }
      }
      if(rolChange){
        if (await userService.updateUser(uid, user)) {
          // se envia el user completo para facilitar pruebas
          res.send({
            status: "success",
            message: "Cambio de rol con éxito",
            payload: user,
          });
        } else {
          res.send({ status: "error", message: "Error en al actualizar en BDD" });
        }
      }
    }
  };

  loadUsers = async (req, res) => {
    try {
      const result = await userService.findUsers({ is_active: true });
      const users = result.map((user) => new UserDTO(user));
      res.send({ status: "success", payload: users });
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  deleteInactiveUsers = async (req, res) => {
    try {
      const limit = new Date();
      // const inactivityTime = 60 * 1000; //PARA PRUEBAS SE USA UN MINUTO
      const inactivityTime = (24*60*60*1000) * 2; //LOS DOS DIAS QUE SOLICITA LA LETRA DEL PROY FINAL
      limit.setTime(limit.getTime() - inactivityTime);
      const query = {
        is_active: true,
        last_connection: {$lte: limit}
      };
      const result = await userService.updateManyUsers(
        query,
        { is_active: false }
      );
      res.send({ status: "success", payload: result });
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  deleteUser = async (req, res) => {
    const uid = req.params.uid;
    const user = await userService.findOneUser({_id: uid});
    if (user.rol === "ADMIN") {
      res.send({
        status: "error",
        message: "Error, el usuario seleccionado es Administrador",
      });
    } else {
      user.is_active = false;
      if (await userService.updateUser(uid, user)) {
        // se envia el user completo para facilitar pruebas
        res.send({
          status: "success",
          message: "Usuario eliminado con éxito",
          payload: user
        });
      } else {
        res.send({ status: "error", message: "Error en al actualizar en BDD" });
      }
    }
  };

  uploadFiles = async (req, res)=>{
    const uid = req.params.uid;
    const user = await userService.findOneUser({_id: uid});
    upload.array('files', 10)(req, res, async(err) => {  
      if (err instanceof multer.MulterError) {
        // Error de multer
        res.status(400).json({ message: err.message });
      } else if (err) {
        // Error de validación de tipo de archivo o cualquier otro error
        res.status(400).json({ message: err.message });
      } else {
        const { type } = req.body;
        const files = req.files;
        const documents = files.map((file) => ({
          name: type,
          reference: file.path
        }));
        // documents.map((doc) => {
        //   user.documents.push(doc);
        // });
        // chequeo si ya existe ese documento guardado y se modifica la referencia en BDD
        documents.forEach(newDoc => {
          let doc = user.documents.find(item => item.name === newDoc.name);
          if(doc){
            doc.reference = newDoc.reference;
          }else{
            user.documents.push(newDoc);
          }
        });
        await userService.updateUser(uid, user);
        res.status(200).send('Archivos subidos correctamente');
      }
    });
  }  
}

export default UserController;
