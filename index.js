const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Permitir que o servidor leia arquivos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal que entrega o HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
const sendMessage = require('./send-whatsapp');

sendMessage.sendWhatsAppMessage('5534992666565', 'Testando envio de mensagem pelo Oespiãogram!');

