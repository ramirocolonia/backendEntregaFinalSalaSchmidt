import express from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import passport from "passport";
import swaggerUI from "swagger-ui-express";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import chatsRouter from "./routes/chats.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import mockingRouter from "./routes/mocking.router.js";
import __dirname from "./utils.js";
import initializePassport from "./config/passport.config.js";
import config from "./config/config.js";
import MongoConnection from "./config/MongoConnection.js";
import errorHandler from "./middlewares/errors/index.js"
import { swaggerSpecs } from "./config/doc.config.js";
import usersRouter from "./routes/users.router.js";

const app = express();
const PORT = config.port || 3000;

const httpServer = app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto ${PORT}`);
});

const mongoConnection = MongoConnection.getInstance();
// const socketServer = await initializeSocketUsers(httpServer);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


initializePassport();
app.use(passport.initialize());

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/chat", chatsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", mockingRouter);
app.use("/api/users", usersRouter);
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
app.use(errorHandler);
