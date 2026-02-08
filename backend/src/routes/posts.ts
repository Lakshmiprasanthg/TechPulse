import { Router } from 'express';
import { body } from 'express-validator';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Validation rules
const createPostValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  body('excerpt').optional().trim(),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published'),
];

const updatePostValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  body('excerpt').optional().trim(),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published'),
];

// Routes
router.get('/', getPosts); // Public - can view all posts
router.get('/:id', getPostById); // Public - can view single post
router.post('/', authenticate, createPostValidation, createPost); // Protected
router.put('/:id', authenticate, updatePostValidation, updatePost); // Protected
router.delete('/:id', authenticate, deletePost); // Protected

export default router;
