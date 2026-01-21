import express from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost
} from '../controllers/postController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(protect, admin, createPost);

router.route('/:slug')
  .get(getPost);

router.route('/id/:id')
  .put(protect, admin, updatePost)
  .delete(protect, admin, deletePost);

router.put('/id/:id/like', protect, likePost);

export default router;
