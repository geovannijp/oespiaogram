document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('oespiaogram-form');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();

    if (!username || !whatsapp) {
      alert('Preencha os dois campos para continuar.');
      return;
    }

    try {
      const { createClient } = supabase;
      const supabaseUrl = 'https://pokrzxuzurjjtcrnkgvl.supabase.co'; // troque pelo seu
      const supabaseKey = '<eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBva3J6eHV6dXJqanRjcm5rZ3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNDAzOTIsImV4cCI6MjA1OTgxNjM5Mn0.q9J4AhLDFSOqAWqQnIE1dsqLMxZO8dCTBzQUarLVhLg>'; // troque pela sua key pública
      const client = createClient(supabaseUrl, supabaseKey);

      const { data, error } = await client
        .from('usuarios')
        .insert([{ username, whatsapp }]);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar dados. Tente novamente.');
      } else {
        console.log('Dados salvos:', data);
        alert('Cadastro salvo com sucesso!');
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      alert('Erro inesperado ao salvar.');
    }
  });
});
