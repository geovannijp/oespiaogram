import { sendWhatsAppMessage } from './send-whatsapp.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://pokrzxuzurjjtcrnkgvl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBva3J6eHV6dXJqanRjcm5rZ3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNDAzOTIsImV4cCI6MjA1OTgxNjM5Mn0.q9J4AhLDFSOqAWqQnIE1dsqLMxZO8dCTBzQUarLVhLg';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('oespiaogram-form');
  const resultArea = document.getElementById('resultArea');

  if (!form) {
    console.error('Formulário não encontrado');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username_instagram = document.getElementById('usernameInput').value.trim();
    const numero_whatsapp = document.getElementById('whatsappInput').value.trim();

    console.log('Número capturado do formulário:', numero_whatsapp);

    if (!username_instagram || !numero_whatsapp) {
      alert('Preencha seu @ do Instagram e número de WhatsApp.');
      return;
    }

    resultArea.innerHTML = '<p>Analisando seguidores...</p>';

    setTimeout(async () => {
      const usuariosFicticios = ['@joao123', '@maria_clara', '@pedroseguidor', '@naotemaisvc'];

      resultArea.innerHTML = `
        <h2 class="text-xl font-bold mb-2">Esses usuários não te seguem de volta:</h2>
        <ul class="list-disc pl-5">
          ${usuariosFicticios.map(user => `<li>${user}</li>`).join('')}
        </ul>
      `;

      // Salva no Supabase e retorna os dados inseridos
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{ username_instagram, numero_whatsapp }])
        .select();

      if (error) {
        console.error('Erro ao salvar no Supabase:', error.message);
        alert('Ocorreu um erro ao salvar. Tente novamente.');
        return;
      }

      console.log('Dados salvos:', data);
      alert('Você será notificado no WhatsApp quando alguém deixar de te seguir!');

      // Envia mensagem para o número fornecido
      try {
        const response = await sendWhatsAppMessage(
          numero_whatsapp,
          '🕵️ Oespiãogram ativado! Você será notificado quando alguém deixar de te seguir no Instagram.'
        );
        console.log('Mensagem enviada com sucesso para:', numero_whatsapp, response);
      } catch (err) {
        console.error('Falha ao enviar mensagem:', err.message);
        alert('Erro ao enviar mensagem no WhatsApp. Verifique o número e tente novamente.');
      }
    }, 2000);
  });
});
