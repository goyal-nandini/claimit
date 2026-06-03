import express from "express";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
  getStats
} from "../controllers/itemController.js";
import protect from "../middleware/authMiddleware.js";
import { upload } from "../utils/cloudinary.js";
import multer from "multer";

const router = express.Router();
router.get('/', getAllItems);
router.get('/stats', getStats);
router.get('/my', protect, getMyItems);
router.get('/:id', getItemById);
router.post('/', protect, upload.single("image"), createItem);

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes('Only JPG')) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);


export default router;