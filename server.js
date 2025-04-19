import express from 'express';
import { scrapeFollowers } from './scrape-followers.js';
import cors from 'cors';

console.log('Iniciando o servidor...');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/scrape', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username é obrigatório' });
  }
  try {
    console.log(`Scraping seguidores para ${username}`);
    const followers = await scrapeFollowers(username);
    res.json({ followers });
  } catch (err) {
    console.error('Erro no servidor:', err);
    res.status(500).json({ error: 'Erro ao buscar seguidores' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}).on('error', (err) => {
  console.error('Erro ao iniciar o servidor:', err);
});
