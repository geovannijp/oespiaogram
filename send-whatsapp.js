const axios = require('axios');

// ⚙️ Troque pelos seus dados reais da Whapi.cloud
const WHAPI_INSTANCE_ID = 'MANTIS-ERQ7T';
const WHAPI_TOKEN = 'GLrMYTDiGonhRo4iLokey2gv5bRwLfvC';

// 📤 Função para enviar mensagem no WhatsApp
async function sendWhatsAppMessage(phone, message) {
  try {
    const response = await axios.post(
      `https://gate.whapi.cloud/messages/text`,
      {
        to: phone,
        body: message,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WHAPI_TOKEN}`,
          'X-Instance-ID': WHAPI_INSTANCE_ID
        },
      }
    );

    console.log('Mensagem enviada com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error.response?.data || error.message);
    throw error;
  }
}

// Exemplo de uso (você pode apagar isso depois de testar)
sendWhatsAppMessage('5534992666565', 'Olá! Esta é uma mensagem de teste do Oespiãogram.');
