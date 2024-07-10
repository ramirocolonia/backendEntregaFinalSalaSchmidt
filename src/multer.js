import multer from "multer";
import __dirname from "./utils.js";
import path from "path";

function fileFilter(req, file, cb) {
  // filtra para que documentos sean solo tipo PDF
  const { type } = req.body;
  if(type === "ID" || type === "ADDRESS" || type === "ACCOUNTSTATEMENT"){
    if(file.mimetype === 'application/pdf'){
      cb(null, true); // Aceptar archivo
    }else{
      cb(new Error ('Solo se permiten archivos PDF'), false); // Rechazar archivo
    }
  }else{
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true); // Aceptar archivo
    } else {
      cb(new Error ('Solo se permiten archivos PDF e imágenes'), false); // Rechazar archivo
    }
  }
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let uploadPath = path.join(__dirname, "public");
    if(file.mimetype.startsWith("image/")){
      if(file.originalname.includes("profile")){
        uploadPath = path.join(uploadPath, "profiles");
      }else if(file.originalname.includes("product")){
        uploadPath = path.join(uploadPath, 'products');
      }
    }else if(file.mimetype.startsWith("application/pdf")){
      uploadPath = path.join(uploadPath, 'documents');
    }else{
      throw new Error('Tipo de archivo no permitido');
    }
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    const{ type, usrID } = req.body;
    const filename = type + usrID;
    cb(null, filename + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});