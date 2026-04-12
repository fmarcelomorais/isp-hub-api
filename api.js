import app from './server.js';
import router from './routes/rotas.js'

const port = process.env.PORT || 3000;

app.use('/api/v1', router);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});