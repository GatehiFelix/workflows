import colors from 'colors';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import http from 'http';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(colors.green(`Server is running on port ${PORT}`));
});