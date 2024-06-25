export default class CustomError extends Error{
  constructor(name, cause, message, code){
    super(message, {cause});
    this.code = code;
    this.name = name;
    Error.captureStackTrace(this, this.constructor);
  }
}