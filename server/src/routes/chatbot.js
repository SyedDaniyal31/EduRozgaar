import { Router } from 'express';
import { chatbotQuery, getChatHistory } from '../controllers/chatbotController.js';
import { requireAuth } from '../middleware/auth.js';

export const chatbotRouter = Router();

chatbotRouter.post('/chatbot/query', requireAuth, chatbotQuery);
chatbotRouter.get('/chatbot/history', requireAuth, getChatHistory);
