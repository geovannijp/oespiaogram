import express from 'express';
import { scrapeFollowers } from './scrape-followers.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/scrape', async (req, res) => {
  const { username } = req.body;
  console.log('[Server] Recebida requisição para:', username);

  if (!username) {
    return res.status(400).json({ error: 'Username é obrigatório' });
  }

  try {
    const followers = await scrapeFollowers(username);
    res.json({ followers });
  } catch (err) {
    console.error('[Server] Erro ao buscar seguidores:', err.message);
    res.status(500).json({ error: 'Erro ao buscar seguidores' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[Server] Servidor rodando na porta ${PORT}`);
});
