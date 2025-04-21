document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('oespiaogram-form');
  const resultArea = document.getElementById('resultArea');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('usernameInput').value.trim();

    if (!username) {
      alert('Digite seu @ do Instagram');
      return;
    }

    resultArea.innerHTML = '<p>🔍 Buscando seguidores...</p>';

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Erro no scraping');

      const seguidores = data.followers || [];

      if (seguidores.length === 0) {
        resultArea.innerHTML = '<p>Nenhum seguidor encontrado.</p>';
      } else {
        resultArea.innerHTML = `
          <h2>Seguidores encontrados:</h2>
          <ul>${seguidores.map(user => `<li>@${user}</li>`).join('')}</ul>
        `;
      }
    } catch (err) {
      console.error('Erro:', err.message);
      resultArea.innerHTML = `<p>❌ ${err.message}</p>`;
    }
  });
});
