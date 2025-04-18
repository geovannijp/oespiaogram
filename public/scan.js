import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://pokxzrzurjictnkgvl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBva3J6eHV6dXJqanRjcm5rZ3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyNDAzOTIsImV4cCI6MjAyOTgxNjM5Mn0.q9J4AhLDFSOqAWqQnIE1dsqLMxZO8dCTBzQUarLVhLg';
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

    resultArea.innerHTML = '<p>Analisando seguidores...</p>';

    setTimeout(async () => {
      const usuariosFicticios = ['@joao123', '@maria_clara', '@pedroseguidor', '@naotemaisvc'];

      resultArea.innerHTML = `
        <h2 class="text-xl font-bold mb-2">Esses usuários não te seguem de volta:</h2>
        <ul class="list-disc pl-5">
          ${usuariosFicticios.map(user => `<li>${user}</li>`).join('')}
        </ul>
      `;

      const { data, error } = await supabase
        .from('usuarios')
        .insert([{ username_instagram, numero_whatsapp }]);

      if (error) {
        console.error('Erro ao salvar no Supabase:', error.message);
        alert('Ocorreu um erro ao salvar. Tente novamente.');
      } else {
        console.log('Dados salvos:', data);
        alert('Você será notificado no WhatsApp quando alguém deixar de te seguir!');
      }
    }, 2000);
  });
});
