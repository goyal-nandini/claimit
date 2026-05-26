import {v2 as cloudinary} from "cloudinary";
import  {CloudinaryStorage}  from "multer-storage-cloudinary";
import multer from "multer";
import env from "dotenv";

env.config();
console.log('API KEY:', process.env.CLOUDINARY_API_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'claimit',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({ storage });

export { upload, cloudinary };