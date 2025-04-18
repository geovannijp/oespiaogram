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
      const supabaseUrl = 'https://<SEU-PROJETO>.supabase.co'; // troque pelo seu
      const supabaseKey = '<SUA-API-KEY>'; // troque pela sua key pública
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
