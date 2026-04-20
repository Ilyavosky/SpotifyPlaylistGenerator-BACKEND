import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import router from './routes/index';
import { errorHandler } from './middleware/errorHandler.middleware';
import { authRefresh } from './middleware/authRefresh.middleware';

const app = express();
const PORT = process.env.PORT || 4000;

app.set('trust proxy', 1);

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(authRefresh);

app.use('/api/v1', router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API Service corriendo en puerto ${PORT}`);
});

export default app;