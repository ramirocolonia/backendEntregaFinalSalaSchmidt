import MailingService from "../services/mailing.js";
import config from "../config/config.js";
import { productService, userService } from "../repositories/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { 
  generateOwnerErrorInfo, 
  generateProductErrorInfo, 
  mongoError, 
  unfindField, 
  uniqueField 
} from "../services/errors/info.js";

class ProductController {

  loadProducts = async (req, res, next) => {
    try {
      let query = {};
      let order = {
        limit: req.query.limit? parseInt(req.query.limit) : 10,
        page: req.query.page? parseInt(req.query.page) : 1,
      };
      if (parseInt(req.query.stock))
        query.stock = { $gte: parseInt(req.query.stock) };
      if (req.query.category) query.category = req.query.category;
      if (parseInt(req.query.sort) == 1 || parseInt(req.query.sort) == -1)
        order.sort = { price: parseInt(req.query.sort) };
      order.lean = true;
      const products = await productService.getProducts(query, order);
      return({ status: "success", payload: products });
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  loadProduct = async (req, res, next) => {
    try {
      const product = await productService.findOneProduct(req.params.pid);
      if (product) {
        res.send({ status: "success", payload: product });
      } else {
        const err = new CustomError(
          "producto no encontrado",
          unfindField("id"),
          "el producto ingresado no existe",
          EErrors.DATABASE_ERROR
        );
        return next(err);
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  newProduct = async (req, res, next) => {
    try{
      const { title, description, code, price, stock, category } = req.body;
      const owner = req.user.usrDTO.email;
      const thumbs = req.body.thumbnails || [];
      if (!(await productService.existCode(code))) {
        let newProduct = {
          title,
          description,
          code,
          price,
          status: true,
          stock,
          category
        };
        if (Object.values(newProduct).every((value) => String(value).trim() !== "" && value !== undefined)){
          newProduct.thumbnails = thumbs;
          newProduct.owner = owner;
          const result = await productService.createProduct(newProduct);
          if (result) {
            res.send({ status: "success", payload: result });
          } else {
            const err = new CustomError(
              "error al guardar",
              mongoError(),
              "error al intentar guardar en BDD",
              EErrors.DATABASE_ERROR
            );
            return next(err);
          }
        } else {
          const err = new CustomError(
            "faltan campos obligatorios",
            generateProductErrorInfo(newProduct),
            "uno o más campos no fueron completados o no coincide el formato",
            EErrors.INVALID_TYPES_ERROR
          );
          return next(err);
        }
      } else {
        const err = new CustomError(
          "código ya existe",
          uniqueField("código"),
          "el código ingresado ya existe",
          EErrors.ALREADY_EXIST
        );
        return next(err);
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  updateProduct = async (req, res, next) => {
    try{
      const newValues = req.body;
      const usr = req.user.usrDTO; 
      if (Object.values(newValues).every((value) => String(value).trim() !== "" && value !== undefined)){
        if(newValues.owner === usr.email || usr.rol === "ADMIN"){
          if (await productService.updateProduct(req.params.pid, newValues)){
            res.send({ status: "success", payload: `Producto id ${req.params.pid} actualizado correctamente` });
          } else {
            const err = new CustomError(
              "error al actualizar",
              mongoError(),
              "error al intentar actualizar el producto en BDD",
              EErrors.DATABASE_ERROR
            );
            return next(err);
          }
        }else{
          const err = new CustomError(
            "faltan permisos",
            generateOwnerErrorInfo(newValues.owner, usr.email),
            "el usuario no es administrador o no coincide con el usuario que registró el producto",
            EErrors.INVALID_TYPES_ERROR
          );
          return next(err);  
        }
      } else {
        const err = new CustomError(
          "faltan campos obligatorios",
          generateProductErrorInfo(newValues),
          "uno o más campos no fueron completados o no coincide el formato",
          EErrors.INVALID_TYPES_ERROR
        );
        return next(err);
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  deleteProduct = async (req, res, next) => {
    try{
      let product = await productService.findOneProduct(req.params.pid);
      const usr = req.user.usrDTO;
      if (product) {
        if(product.owner === usr.email || usr.rol === "ADMIN"){
          if (await productService.deleteProduct(product)) {
            if(product.owner !== config.admin){
              const usrOwner = await userService.findOneUser({email: product.owner});
              const mailer = new MailingService();
              const mailOpts = {
                from: "Ecommerce",
                to: usrOwner.email,
                subject: `Producto ${product._id} eliminado`,
                html: `
                  <p>Su producto ${product._id} fue eliminado correctamente</p>`
              };
              await mailer.sendSimpleMail(mailOpts);
            }
            res.send({ status: "success", payload: `Producto id ${req.params.pid} eliminado correctamente` });
          } else {
            const err = new CustomError(
              "error al eliminar",
              mongoError(),
              "error al intentar eliminar el producto en BDD",
              EErrors.DATABASE_ERROR
            );
            return next(err);
          }
        }else{
          const err = new CustomError(
            "faltan permisos",
            generateOwnerErrorInfo(product.owner, usr.email),
            "el usuario no es administrador o no coincide con el usuario que registró el producto",
            EErrors.INVALID_TYPES_ERROR
          );
          return next(err);  
        }
      }else {
        const err = new CustomError(
          "producto no encontrado",
          unfindField("id"),
          "el producto ingresado no existe",
          EErrors.DATABASE_ERROR
        );
        return next(err);
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };
}

export default ProductController;
