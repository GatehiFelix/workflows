import colors from 'colors';
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import connectDB from './config/db.js';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import botRoutes from './routes/botRoutes.js';
import workflowRoutes from './routes/workflowRoutes.js';
import workflowNodesRoutes from './routes/workflowNodesRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

connectDB();


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/workflows', workflowNodesRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is healthy' });
})

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(colors.green(`Server is running on port ${PORT}`));
});