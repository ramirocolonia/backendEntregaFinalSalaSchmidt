import * as chai from "chai";
import supertest from "supertest";
import { generateProducts } from "../src/utils.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de api ecommerce", () => {
  let cookie;
  describe("Test de sección Productos", () => {
    it("GET /api/products/:pid retorna un objeto producto por id", async function () {
      const { _body, statusCode } = await requester.get("/api/products/6656fe0930515380f1ae2720");
      expect(statusCode).to.equal(200);
      expect(_body.payload).to.have.property("_id");
    });

    it("POST /api/products debe guardar un producto correctamente", async function (){
      // genero un producto aleatorio con la libreria faker para ser integrado luego
      const product = generateProducts(1)[0];

      // cargamos la cookie para probar este y los siguientes test que requieren autenticacion
      const result = await requester.post("/login").send({email:"ramiro.sala85@gmail.com", password:"hola"});
      const cookieResult = result.headers["set-cookie"][0];
      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1]
      }
      const {statusCode, _body} = await requester.post("/api/products").set("Cookie", [`${cookie.name}=${cookie.value}`]).send(product);
      expect(statusCode).to.equal(200);
      expect(_body.payload).to.be.ok;
    });

    it("DELETE /api/products/:pid retorna 401 al intentar eliminar un producto de otro usuario", async function (){
      // genero un producto aleatorio con la libreria faker para ser integrado luego
      const product = generateProducts(1)[0];
      // guarda un producto con el usuario logueado (ramiro.sala85@gmail.com)
      const result = await requester.post("/api/products").set("Cookie", [`${cookie.name}=${cookie.value}`]).send(product);
      
      // se loguea otro usuario y desea eliminar ese producto
      const usrLog = await requester.post("/login").send({email:"luis@mail.com", password:"hola"});
      const cookieResult = usrLog.headers["set-cookie"][0];
      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1]
      }
      const {statusCode} = await requester.delete(`/api/products/${result.body.payload._id}`).set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(statusCode).to.equal(404);
    });
  });

  describe("Test de sección Carts", () => {
    it("POST /api/carts/:cid/products/:pid guarda un producto (pid) en un cart (cid)", async function () {
      // se loguea otro usuario
      const usrLog = await requester.post("/login").send({email:"ramiro.sala85@gmail.com", password:"hola"});
      const cookieResult = usrLog.headers["set-cookie"][0];
      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1]
      }
      const { statusCode } = await requester.post("/api/carts/6655ed0f56a8437ed0146a69/products/665f326d0becfefec16101f8").set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(statusCode).to.equal(200);
    });

    it("POST /api/carts/:cid/products/:pid no agrega producto por ser un producto propio", async function () {
      const { _body, statusCode } = await requester.post("/api/carts/6655ed0f56a8437ed0146a69/products/665f32900becfefec16101fd").set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(statusCode).to.equal(200);
      expect(_body.status).eql("error");
    });

    it("DELETE /api/carts/:cid retorna ok luego de eliminar todos los productos de un cart por id", async function (){
      const {statusCode} = await requester.delete(`/api/carts/6655ed0f56a8437ed0146a69`);
      expect(statusCode).to.equal(200);
    });
  });

  describe("Test de sección Sessions", () => {
    let rolActual;
    it("GET /api/sessions/current, Test de cookie ok", async function() {
      const {_body} = await requester.get("/api/sessions/current").set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(_body).to.have.property("usrDTO");
      expect(_body.usrDTO.email).equal("ramiro.sala85@gmail.com");
    });

    it("POST /register, debe retornar error porque el correo ya se encuentra registrado", async ()=>{
      const newUser = {
        first_name: "Luis",
        last_name: "Gonzalez",
        email: "luis@mail.com",
        password: "hola123"
      };
      const {statusCode, _body} = await requester.post("/register").send(newUser);
      expect(statusCode).to.equal(404);
      expect(_body.status).equals("error");
    });

    it("POST /api/users/premium/:uid cambia el rol de PREMIUM a USER y viceversa", async function () {
      // se loguea otro usuario para cambiar rol
      const usrLog = await requester.post("/login").send({email:"fede@mail.com", password:"hola"});
      const cookieResult = usrLog.headers["set-cookie"][0];
      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1]
      }
      const actualUsr = await requester.get("/api/sessions/current").set("Cookie", [`${cookie.name}=${cookie.value}`]);
      rolActual = actualUsr.rol;

      const { statusCode, _body } = await requester.post("/api/users/premium/6655ed0f56a8437ed0146a6b").set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(statusCode).to.equal(200);
      expect(_body.payload.rol).not.equal(rolActual);
    });
  });
});
