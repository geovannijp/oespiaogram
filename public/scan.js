import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
  const checkBtn = document.getElementById('checkBtn');
  const notifyBtn = document.getElementById('notifyBtn');
  const resultArea = document.getElementById('resultArea');

  checkBtn.addEventListener('click', () => {
    resultArea.innerHTML = '<p>Analisando seguidores...</p>';

    setTimeout(() => {
      const usuariosFicticios = [
        '@joao123',
        '@maria_clara',
        '@pedroseguidor',
        '@naotemaisvc'
      ];

      resultArea.innerHTML = `
        <h2 class="text-xl font-bold mb-2">Esses usuários não te seguem de volta:</h2>
        <ul class="list-disc pl-5">
          ${usuariosFicticios.map(user => `<li>${user}</li>`).join('')}
        </ul>
      `;
    }, 2000);
  });

  notifyBtn.addEventListener('click', async () => {
    const username = document.getElementById('usernameInput').value.trim();
    const whatsapp = document.getElementById('whatsappInput').value.trim();

    if (!username || !whatsapp) {
      alert('Preencha seu @ do Instagram e número de WhatsApp.');
      return;
    }

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ username, whatsapp }]);

    if (error) {
      console.error('Erro ao salvar no Supabase:', error.message);
      alert('Ocorreu um erro. Tente novamente.');
    } else {
      alert('Você será notificado no WhatsApp quando alguém deixar de te seguir!');
      console.log('Dados salvos:', data);
    }
  });
});
