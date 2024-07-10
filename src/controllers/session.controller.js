import jwt from "jsonwebtoken";

import { createHash, isValidPassword } from "../utils.js";
import config from "../config/config.js";
import { userService } from "../repositories/index.js";
import SessionDTO from "../dao/DTOs/session.dto.js";
import CustomError from "../services/errors/CustomError.js";
import { generateUserErrorInfo, mongoError, unfindField, uniqueField } from "../services/errors/info.js";
import EErrors from "../services/errors/enums.js";
import MailingService from "../services/mailing.js";

class SessionController {

  registerUser = async (req, res, next) => {
    try {
      const { first_name, last_name, rol, email, age, password } = req.body;
      if (!(await userService.existEmail(email))) {
        let newUser = {
          first_name,
          last_name,
          rol,
          email,
          age,
          password: password,
          last_connection: new Date().getTime()
        };
        if (Object.values(newUser).every((value) => String(value).trim() !== "" && value !== undefined)) {
          newUser.password = createHash(password);
          const result = await userService.createUser(newUser);
          if (result) {
            res.send({ status: "success", payload: result });
          } else {
            const err = new CustomError(
              "error de mongoDB",
              mongoError(),
              "falla al guardar el usuario en BDD",
              EErrors.DATABASE_ERROR
            )
            return next(err);
          }
        } else {
          const err = new CustomError(
            "error al crear usuario",
            generateUserErrorInfo(newUser),
            "faltan campos obligatorios para crear usuario",
            EErrors.INVALID_TYPES_ERROR
          )
          return next(err);
        }
      } else {
        const err = new CustomError(
          "correo ya existe",
          uniqueField("email"),
          "el correo ingresado ya existe",
          EErrors.ALREADY_EXIST
        );
        return next(err);
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  login = async (req, res, next) => {
    const { email, password } = req.body;
    let usrDTO;
    if (email === config.admin && password === config.passAdmin) {
      usrDTO = {
        first_name: "",
        last_name: "Administrador",
        email: email,
        age: 0,
        rol: "ADMIN",
      };
      const token = jwt.sign({usrDTO}, config.tokenPass, {expiresIn: "24h"});
      res.cookie("tokenUsrCookie", token, {maxAge: 60 * 60 * 1000 * 24, httpOnly: true});
      
      // retorna asi para que les resulte mas facil en las correcciones
      res.send({ status: "success", payload: usrDTO, token: token });
    } else {
      const user = await userService.findOneUser({email: email});
      if (user) {
        if (isValidPassword(user, password)) {
          await userService.updateUser(user._id, {last_connection: new Date().getTime()})
          usrDTO = new SessionDTO(user);
          const token = jwt.sign({usrDTO}, config.tokenPass, {expiresIn: "24h"});
          res.cookie("tokenUsrCookie", token, {maxAge: 60 * 60 * 1000 * 24, httpOnly: true});
          
          // se envia user completo en lugar de dto para tener toda la info para testear 
          res.send({ status: "success", payload: user, token: token });
        } else {
          res.send({ status: "error", message: "Contraseña incorrecta" });
        }
      } else {
        const err = new CustomError(
          "usuario no registrado",
          unfindField("email"),
          "el correo ingresado no existe",
          EErrors.DATABASE_ERROR
        );
        return next(err);
      }
    }
  };

  logout = async(req, res) =>{
    const user = await userService.findOneUser({email: req.user.usrDTO.email});
    await userService.updateUser(user._id, {last_connection: new Date().getTime()})
    res.clearCookie("tokenUsrCookie")
    res.redirect("/login");
  }

  passRecoveryMail = async (req, res) =>{
    const {email} = req.body;
    const user = await userService.findOneUser({email: email});
    if(user){
      const email = user.email;
      const token = jwt.sign({email}, config.tokenPass, {expiresIn: "1h"});
      const mailer = new MailingService();
      const mailOpts = {
        from: "Ecommerce",
        to: user.email,
        subject: "Recuperación de contraseña",
        html: `
              <p>Click en el siguiente enlace para recuperar contraseña: </p>
              <a href = "http://localhost:8080/api/sessions/resetPass/${token}">Recuperar Contraseña</a>`
      };
      await mailer.sendSimpleMail(mailOpts);
      res.status(200).send({status: "success", message: "Email enviado"});
    }
  }  

  resetPassToken = async (req, res) =>{
    const token = req.params.token;
    jwt.verify(token, config.tokenPass, (error, decoded) =>{
      if(error) return res.redirect("/api/sessions/resetPass")
      else{
        res.cookie("cookieUsr", decoded.email, { httpOnly: true });
        res.render("newPass", {user:decoded.email});
      } 
    });
  }

  updatePass = async (req, res) =>{
    const email = req.cookies.cookieUsr;
    const user = await userService.findOneUser({email: email});
    const newPassword = req.body.pass;
    if(!isValidPassword(user, newPassword)){
      user.password = createHash(newPassword);
      if(await userService.updateUser(user._id, user)){
        res.clearCookie("cookieUsr");
        res.send({ 
          status: "success",
          message: `Cambio de contraseña correcto para el usuario ${user.email}`, 
          payload:  user });
      }else{
        res.send({ status: "error", message: "Error en al actualizar en BDD"});
      }
    }else{
      res.send({ status: "error", message: "La contraseña ingresada es igual a la actual"});
    }
  }
}
export default SessionController;
