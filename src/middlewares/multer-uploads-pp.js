import multer from "multer";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const MIMETYPES = ["image/png", "image/jpg", "image/jpeg"];
const MAX_SIZE = 100000000; // 100MB

const createMulterConfig = (destinationFolder, fieldName, multiple = false) => {
  // Asegurar que el directorio existe
  const fullPath = join(CURRENT_DIR, destinationFolder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const fileExtension = extname(file.originalname);
      const fileName = file.originalname.split(fileExtension)[0];
      cb(null, `${fileName}-${Date.now()}${fileExtension}`);
    },
  });

  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (MIMETYPES.includes(file.mimetype)) cb(null, true);
      else
        cb(
          new Error(
            `Solamente se aceptan archivos de los siguientes tipos: ${MIMETYPES.join(
              " "
            )}`
          )
        );
    },
    limits: { fileSize: MAX_SIZE },
  });

  return multiple ? upload.array(fieldName, 5) : upload.single(fieldName);
};

// Exportar los middlewares directamente
export const uploadProfilePicture = createMulterConfig(
  "../../public/uploads/profile-pictures",
  "profilePicture"
);

export const uploadProductImages = createMulterConfig(
  "../../public/uploads/product-images",
  "productFoto",
  true
);
