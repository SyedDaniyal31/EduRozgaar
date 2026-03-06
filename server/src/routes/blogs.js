import { Router } from 'express';
import { getBlogs, getBlogByIdOrSlug } from '../controllers/blogsController.js';
import { autoGenerateBlog } from '../controllers/blogsAutoGenerateController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export const blogsRouter = Router();

blogsRouter.get('/blogs', getBlogs);
blogsRouter.post('/blogs/auto-generate', requireAuth, requireAdmin, autoGenerateBlog);
blogsRouter.get('/blogs/:idOrSlug', getBlogByIdOrSlug);
