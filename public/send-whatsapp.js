export async function sendWhatsAppMessage(phoneNumber, message) {
  try {
    // Remove tudo que não for número
    let numeroFormatado = phoneNumber.replace(/\D/g, '');

    // Garante que tem o DDI (Brasil = 55)
    if (!numeroFormatado.startsWith('55')) {
      numeroFormatado = '55' + numeroFormatado;
    }

    console.log('Enviando mensagem para:', numeroFormatado);

    const response = await fetch('https://api.whapi.cloud/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer SEU_TOKEN_AQUI' // <-- substitua pelo seu token válido
      },
      body: JSON.stringify({
        phone: numeroFormatado,
        message
      })
    });

    const data = await response.json();
    console.log('Resposta do WhatsApp:', data);
    return data;
  } catch (err) {
    console.error('Erro ao enviar mensagem:', err);
  }
}
