import { sendWhatsAppMessage } from '../send-whatsapp.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://pokrzxuzurjjtcrnkgvl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBva3J6eHV6dXJqanRjcm5rZ3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNDAzOTIsImV4cCI6MjA1OTgxNjM5Mn0.q9J4AhLDFSOqAWqQnIE1dsqLMxZO8dCTBzQUarLVhLg'; // Mantenha sua chave completa
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

    if (!username_instagram || !numero_whatsapp) {
      alert('Preencha seu @ do Instagram e número de WhatsApp.');
      return;
    }

    resultArea.innerHTML = '<p>🔎 Analisando seguidores...</p>';

    try {
      // Chamar o endpoint do servidor para scraping
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username_instagram }),
      });

      const data = await response.json(); // Primeira declaração de 'data'

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar seguidores');
      }

      const seguidores = data.followers || [];

      if (!seguidores || seguidores.length === 0) {
        resultArea.innerHTML = '<p>Nenhum dado encontrado ou perfil inválido.</p>';
        return;
      }

      resultArea.innerHTML = `
        <h2 class="text-xl font-bold mb-2">Esses usuários não te seguem de volta:</h2>
        <ul class="list-disc pl-5">
          ${seguidores.map(user => `<li>@${user}</li>`).join('')}
        </ul>
        <p class="mt-4 text-sm text-gray-500">(Você será notificado se algum deixar de te seguir.)</p>
      `;

      // Salvar no Supabase
      const { data: supabaseData, error } = await supabase // Renomeado 'data' para 'supabaseData'
        .from('usuarios')
        .insert([{ username_instagram, numero_whatsapp }])
        .select();

      if (error) {
        console.error('Erro ao salvar no Supabase:', error.message);
        alert('Erro ao salvar no banco. Tente novamente.');
        return;
      }

      // Enviar mensagem no WhatsApp
      await sendWhatsAppMessage(
        numero_whatsapp,
        '🕵️ Oespiãogram ativado! Você será notificado quando alguém deixar de te seguir no Instagram.'
      );

      alert('Você será notificado quando perder seguidores. Tudo certo!');
    } catch (err) {
      console.error('Erro no processo:', err.message);
      alert('Erro na varredura. Tente novamente em alguns minutos.');
    }
  });
});
