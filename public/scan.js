import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('oespiaogram-form');
  const resultArea = document.getElementById('resultArea');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('usernameInput').value.trim();
    const whatsapp = document.getElementById('whatsappInput').value.trim();

    if (!username || !whatsapp) {
      alert('Preencha seu @ do Instagram e número de WhatsApp.');
      return;
    }

    // Simula análise de seguidores
    resultArea.innerHTML = '<p>Analisando seguidores...</p>';

    setTimeout(async () => {
      const usuariosFicticios = ['@joao123', '@maria_clara', '@pedroseguidor', '@naotemaisvc'];

      resultArea.innerHTML = `
        <h2 class="text-xl font-bold mb-2">Esses usuários não te seguem de volta:</h2>
        <ul class="list-disc pl-5">
          ${usuariosFicticios.map(user => `<li>${user}</li>`).join('')}
        </ul>
      `;

      // Salva no Supabase
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{ username, whatsapp }]);

      if (error) {
        console.error('Erro ao salvar no Supabase:', error.message);
        alert('Ocorreu um erro ao salvar. Tente novamente.');
      } else {
        alert('Você será notificado no WhatsApp quando alguém deixar de te seguir!');
        console.log('Dados salvos:', data);
      }
    }, 2000);
  });
});
