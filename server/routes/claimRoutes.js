import express from 'express';
import { createClaim, approveClaim, rejectClaim, getClaimsForItem, getMyClaims } from '../controllers/claimController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/:itemId', protect, createClaim);
router.put('/:id/approve', protect, approveClaim);
router.put('/:id/reject', protect, rejectClaim);
router.get('/:itemId', protect, getClaimsForItem);
router.get('/my/all', protect, getMyClaims);

export default router;