import { Router } from 'express';
import { getForeignStudies, getForeignStudyByIdOrSlug } from '../controllers/foreignStudiesController.js';

export const foreignStudiesRouter = Router();

foreignStudiesRouter.get('/foreign-studies', getForeignStudies);
foreignStudiesRouter.get('/foreign-studies/:idOrSlug', getForeignStudyByIdOrSlug);
