import express from 'express';
import multer from 'multer';
import {
  getAllItems,
  getStats,
  getMyItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/itemController.js';
import protect from '../middleware/authMiddleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

// Public routes — specific before dynamic
router.get('/stats', getStats);
router.get('/my', protect, getMyItems);
router.get('/', getAllItems);
router.get('/:id', getItemById);

// Protected routes
router.post('/', protect, upload.single('image'), createItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

// Multer error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message?.includes('Only JPG')) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

export default router;