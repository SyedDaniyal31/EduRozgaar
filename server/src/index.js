import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import { connectDB } from './config/db.js';
import { startScraperCron } from './scheduler/cron.js';
import { healthRouter, jobsRouter, scholarshipsRouter, admissionsRouter, blogsRouter, foreignStudiesRouter, authRouter, adminRouter, trendingRouter, newsletterRouter, notificationsRouter, monetizationRouter, usersRouter, v1Router, examsRouter, internshipsRouter, chatbotRouter, webinarsRouter, intlScholarshipsRouter, badgesRouter } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { apiLimiter } from './middleware/rateLimit.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize());
app.use(requestLogger);
app.use('/api', apiLimiter);

app.use('/api', healthRouter);
app.use('/api', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api', jobsRouter);
app.use('/api', scholarshipsRouter);
app.use('/api', admissionsRouter);
app.use('/api', blogsRouter);
app.use('/api', foreignStudiesRouter);
app.use('/api', trendingRouter);
app.use('/api', newsletterRouter);
app.use('/api', notificationsRouter);
app.use('/api', monetizationRouter);
app.use('/api', usersRouter);
app.use('/api', examsRouter);
app.use('/api', internshipsRouter);
app.use('/api', chatbotRouter);
app.use('/api', webinarsRouter);
app.use('/api', intlScholarshipsRouter);
app.use('/api', badgesRouter);
app.use('/api/v1', v1Router);

app.use(errorHandler);

connectDB()
  .then(() => {
    startScraperCron();
    app.listen(PORT, () => {
      console.log(`EduRozgaar API running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection failed:', err);
    process.exit(1);
  });
