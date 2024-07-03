import { Server } from "socket.io";
import { userService } from "../repositories/index.js";
import UserDTO from "../dao/DTOs/user.dto.js";

export async function initializeSocketUsers(server){
  const io = new Server(server);

  io.on("connection", async (socket) => {
    console.log("Conectado a socket server");
    try {
      const result = await userService.findUsers({ is_active: true });
      const users = result.map(user => new UserDTO(user));
      io.emit("users", users);
    } catch (error) {
      console.log("error en conexion a socket server " + error);
    }
  });

  return io;
}