import winston from "winston";
import config from "../config/config.js";

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "green",
    http: "blue",
    debug: "grey"
  }
}

// se crea el logger dependiendo si es entorno development o production...
const logger = startLogger();

function startLogger() {
  if(config.environment === "development"){
    const devLogger = winston.createLogger({
      levels: customLevels.levels,
      transports: [
        new winston.transports.Console({
          level: "debug",
          format: winston.format.combine(
            winston.format.colorize({colors: customLevels.colors}),
            winston.format.simple()
          )
        }),
      ]
    });
    return devLogger;
  }else{
    const prodLogger = winston.createLogger({
      levels: customLevels.levels,
      transports: [
        new winston.transports.Console({
          level: "info",
          format: winston.format.combine(
            winston.format.colorize({colors: customLevels.colors}),
            winston.format.simple()
          )
        }),
        new winston.transports.File({
          filename: "./errors.log", 
          level: "error"},
          winston.format.simple()
        )
      ]
    });
    return prodLogger;
  }
}

winston.addColors(customLevels.colors);

Object.keys(customLevels.levels).forEach((level) => {
  logger[level] = function (message) {
    logger.log({level: level, message: message});
  };
});

export const addLogger = (req, res, next) =>{
  req.logger = logger;
  next();
};