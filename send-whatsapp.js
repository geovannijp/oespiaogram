const axios = require('axios');

const WHAPI_INSTANCE_ID = 'MANTIS-ERQ7T';
const WHAPI_TOKEN = 'GLrMYTDiGonhRo4iLokey2gv5bRwLfvC';

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

// 👇 Isso é importante pra poder importar a função em outro arquivo
module.exports = { sendWhatsAppMessage };
