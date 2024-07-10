import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import passport from "passport";
import { fakerES as faker} from "@faker-js/faker";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export const passportCall = (strategy, policies) =>{
  return (req, res, next) =>{
    passport.authenticate(strategy, function(error, user, info) {
      if(error) return next(error);
      if (!policies.includes("PUBLIC")) {
        if(!user){
          return res.status(401).send({error: info.messages ? info.messages : info.toString()});
        }
        const rol = user.usrDTO.rol;
        if(!policies.includes(rol)){
          return res.status(403).send({error: "error", message: "Permisos insuficientes" });
        }
        req.user = user;  
      }
      next();
    })(req, res, next);
  }
}

export const generateProducts = (quantity) =>{
  let products = [];
  for (let i = 0; i < quantity; i++) {
    let thumbnails = generateThumbnails();
    let product = {};
    product.title = faker.commerce.product();
    product.description = faker.commerce.productDescription();
    product.code = faker.string.alphanumeric(15);
    product.price = parseFloat(faker.commerce.price({ min:1 }));
    product.status = true;
    product.stock = faker.number.int({min: 0, max: 999})
    product.category = faker.commerce.department();
    product.thumbnails = thumbnails;
    products.push(product);    
  }
  return products;
}

const generateThumbnails = () =>{
  let thumbnails = [];
  let times = faker.number.int({min: 0, max: 5});
  for (let i = 0; i < times; i++){
    thumbnails.push(faker.image.url());
  }
  return thumbnails;
}