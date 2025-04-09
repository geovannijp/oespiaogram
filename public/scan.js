import { supabase } from './supabaseClient.js'
document.addEventListener('DOMContentLoaded', () => {
  const checkBtn = document.getElementById('checkBtn');
  const resultArea = document.getElementById('resultArea');

  checkBtn.addEventListener('click', () => {
    resultArea.innerHTML = '<p>Analisando seguidores...</p>';

    // Simulando varredura com delay
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
});
// Teste simples de conexão com Supabase
async function testarSupabase() {
  const { data, error } = await supabase.from('usuarios').select('*');

  if (error) {
    console.error('Erro na conexão com Supabase:', error.message);
  } else {
    console.log('Conexão com Supabase funcionando! Dados recebidos:', data);
  }
}

testarSupabase();
