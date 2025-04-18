export async function sendWhatsAppMessage(phoneNumber, message) {
  try {
    // Remove tudo que não for número
    let numeroFormatado = phoneNumber.replace(/\D/g, '');

    // Garante que tem o DDI (Brasil = 55)
    if (!numeroFormatado.startsWith('55')) {
      numeroFormatado = '55' + numeroFormatado;
    }

    console.log('Enviando mensagem para:', numeroFormatado);

    const response = await fetch('https://gate.whapi.cloud/messages/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer GLrMYTDiGonhRo4iLokey2gv5bRwLfvC'
      },
      body: JSON.stringify({
        to: numeroFormatado + '@c.us',
        body: message
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Resposta do WhatsApp:', data);
    return data;
  } catch (err) {
    console.error('Erro ao enviar mensagem:', err.message);
    throw err;
  }
}
