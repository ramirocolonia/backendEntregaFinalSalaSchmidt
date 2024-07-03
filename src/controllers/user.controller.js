import UserDTO from "../dao/DTOs/user.dto.js";
import { userService } from "../repositories/index.js";

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
      if (user.rol === "PREMIUM") {
        user.rol = "USER";
      } else {
        user.rol = "PREMIUM";
      }
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
      const inactivityTime = 60 * 1000; //PARA PRUEBAS SE USA UN MINUTO
      // const inactivityTime = (24*60*60*1000) * 2; LOS DOS DIAS QUE SOLICITA LA LETRA DEL PROY FINAL
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
  
}

export default UserController;
