import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import routerHome from '../routes/home.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Suas rotas principais
app.use('/home', routerHome);

app.get('/', (req, res) => {
    res.send('Rota ok')
})
// ✅ Export serverless
export default serverless(app);
