import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import routerHome from '../routes/home.js';
import suporte from '../routes/suporte.js';
import auth from '../routes/auth.js';
import cliente from '../routes/cliente.js';
import faturas from '../routes/faturas.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Suas rotas principais
app.use('/auth', auth);
app.use('/home', routerHome);
app.use('/clientes', cliente);
app.use('/faturas', faturas);
app.use('/suporte', suporte);

// ✅ Export serverless
export default serverless(app);
