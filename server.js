import express from 'express';
import { scrapeFollowers } from './scrape-followers.js';
import cors from 'cors';

console.log('[Server] Iniciando o servidor...');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/scrape', async (req, res) => {
  const { username } = req.body;
  console.log('[Server] Recebida requisição para username:', username);
  if (!username) {
    console.error('[Server] Erro: Username não fornecido');
    return res.status(400).json({ error: 'Username é obrigatório' });
  }
  try {
    const followers = await scrapeFollowers(username);
    console.log('[Server] Seguidores retornados:', followers);
    res.json({ followers });
  } catch (err) {
    console.error('[Server] Erro no endpoint /api/scrape:', err.message);
    res.status(500).json({ error: 'Erro ao buscar seguidores' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[Server] Servidor rodando na porta ${PORT}`);
}).on('error', (err) => {
  console.error('[Server] Erro ao iniciar o servidor:', err);
});
