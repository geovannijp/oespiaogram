import { sendWhatsAppMessage } from './send-whatsapp.js';
import { scrapeFollowers } from './scrape-followers.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://pokrzxuzurjjtcrnkgvl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // mantenha completo
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
      // 🧠 CHAMADA REAL DO SCRAPER
      const seguidores = await scrapeFollowers(username_instagram);

      if (!seguidores || seguidores.length === 0) {
        resultArea.innerHTML = '<p>Nenhum seguidor encontrado ou perfil inválido.</p>';
        return;
      }

      resultArea.innerHTML = `
        <h2 class="text-xl font-bold mb-2">Esses usuários te seguem:</h2>
        <ul class="list-disc pl-5">
          ${seguidores.map(user => `<li>@${user}</li>`).join('')}
        </ul>
        <p class="mt-4 text-sm text-gray-500">(Ainda não comparamos quem deixou de seguir – em breve!)</p>
      `;

      // 💾 Salva no Supabase
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{ username_instagram, numero_whatsapp }])
        .select();

      if (error) {
        console.error('Erro ao salvar no Supabase:', error.message);
        alert('Erro ao salvar no banco. Tente novamente.');
        return;
      }

      // 📲 Envia mensagem no WhatsApp
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
