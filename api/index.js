import express from 'express';
import serverless from 'serverless-http';

const app = express();

app.get('/', (req, res) => {
  res.send('API OK 🚀');
});

export default serverless(app);