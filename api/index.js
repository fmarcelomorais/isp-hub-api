import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import routerHome from '../routes/home.js';
import suporte from '../routes/suporte.js';
import auth from '../routes/auth.js';
import cliente from '../routes/cliente.js';
import faturas from '../routes/faturas.js';
import ixc from '../routes/ixcsoft.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`REQ: ${req.method} ${req.url}`);
    next();
});

app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use('/api/ixc', ixc);
// ✅ Suas rotas principais
app.use('/api/auth', auth);
app.use('/api/home', routerHome);
app.use('/api/clientes', cliente);
app.use('/api/faturas', faturas);
app.use('/api/suporte', suporte);


app.get('/', (req, res) => res.json({ status: "online" }));

app.use((req, res) => {
    res.status(404).json({ 
        error: "Rota não encontrada no Express",
        path: req.url 
    });
});
// ✅ 4. Catch-all: Responde 404 para qualquer rota inexistente
// Isso impede que a função fique rodando até o limite de tempo
app.use((req, res) => {
    res.status(404).json({ error: "Rota não encontrada" });
});


app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});

// ✅ Export serverless
/* export default serverless(app);

export const config = {
  maxDuration: 10, // Máximo para plano Hobby. No Pro, você pode aumentar.
};
 */