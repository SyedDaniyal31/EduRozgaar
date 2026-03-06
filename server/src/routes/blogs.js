import { Router } from 'express';
import { getBlogs, getBlogByIdOrSlug } from '../controllers/blogsController.js';

export const blogsRouter = Router();

blogsRouter.get('/blogs', getBlogs);
blogsRouter.get('/blogs/:idOrSlug', getBlogByIdOrSlug);
