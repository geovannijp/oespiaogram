export async function sendWhatsAppMessage(numero, mensagem) {
  const instanceId = 'MANTIS-ERQ7T';
  const token = 'GLrMYTDiGonhRo4iLokey2gv5bRwLfvC';

  const url = `https://gate.whapi.cloud/messages/text`;

  const payload = {
    to: `55${numero}`, // Adiciona o 55 na frente do número
    body: mensagem
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Resposta da Whapi:', data);
    return data;
  } catch (error) {
    console.error('Erro ao enviar mensagem via WhatsApp:', error);
    return null;
  }
}
