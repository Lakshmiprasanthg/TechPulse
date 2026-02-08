import { Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Get all posts with pagination, search, and filter
export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Add search filter
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    // Add status filter
    if (status && (status === 'draft' || status === 'published')) {
      where.status = status;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch posts',
    });
  }
};

// Get single post by ID
export const getPostById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid post ID',
      });
      return;
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      res.status(404).json({
        success: false,
        error: 'Post not found',
      });
      return;
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch post',
    });
  }
};

// Create a new post
export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { title, content, excerpt, status = 'draft' } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        status,
        authorId: req.userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create post',
    });
  }
};

// Update post
export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid post ID',
      });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    // Check if post exists and belongs to user
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      res.status(404).json({
        success: false,
        error: 'Post not found',
      });
      return;
    }

    if (existingPost.authorId !== req.userId) {
      res.status(403).json({
        success: false,
        error: 'You do not have permission to update this post',
      });
      return;
    }

    const { title, content, excerpt, status } = req.body;

    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(status && { status }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post,
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update post',
    });
  }
};

// Delete post
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid post ID',
      });
      return;
    }

    // Check if post exists and belongs to user
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      res.status(404).json({
        success: false,
        error: 'Post not found',
      });
      return;
    }

    if (existingPost.authorId !== req.userId) {
      res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this post',
      });
      return;
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete post',
    });
  }
};
