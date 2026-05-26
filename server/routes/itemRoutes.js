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

const router = express.Router();
router.get('/', getAllItems);
router.get('/stats', getStats);
router.get('/my', protect, getMyItems);
router.get('/:id', getItemById);
router.post('/', protect, upload.single("image"), createItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);


export default router;