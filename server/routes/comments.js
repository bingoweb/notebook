import express from 'express';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  approveComment
} from '../controllers/commentController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createComment);

router.route('/:postId')
  .get(getComments);

router.route('/comment/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

router.put('/comment/:id/approve', protect, admin, approveComment);

export default router;
