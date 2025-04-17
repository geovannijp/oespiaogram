const axios = require('axios');

const sendWhatsApp = async (phoneNumber, message) => {
  try {
    const response = await axios.post(
      'https://gate.whapi.cloud/messages/text',
      {
        to: phoneNumber,
        body: message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHAPI_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Mensagem enviada com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = sendWhatsApp;
