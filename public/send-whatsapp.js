export async function sendWhatsAppMessage(phoneNumber, message) {
  try {
    const response = await fetch('https://gate.whapi.cloud/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer GLrMYTDiGonhRo4iLokey2gv5bRwLfvC'
      },
      body: JSON.stringify({
        phone: phoneNumber, // <- ESSE CAMPO AQUI
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
