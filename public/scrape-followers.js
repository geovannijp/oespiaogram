export async function scrapeFollowers(username) {
  const token = 'apify_api_a1TA0riNUXUbIjnhUMfFRPJ2VeX6e12VOh08';

  try {
    // Inicia a execução do scraper
    const startRun = await fetch(`https://api.apify.com/v2/acts/apify/instagram-scraper/runs?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: {
          directUrls: [`https://www.instagram.com/${username}`],
          resultsLimit: 10
        }
      }),
    });

    const runData = await startRun.json();
    const runId = runData.data.id;

    // Espera até o scraper terminar
    let isFinished = false;
    let runResult = null;

    while (!isFinished) {
      const checkStatus = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
      runResult = await checkStatus.json();
      isFinished = runResult.data.status === 'SUCCEEDED';

      if (!isFinished) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    // Pega o dataset com os resultados
    const datasetId = runResult.data.defaultDatasetId;
    const datasetRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&clean=true`);
    const dataset = await datasetRes.json();

    // Extrai a lista de seguidores
    const followers = dataset[0]?.followers || [];

    return followers.map(user => user.username || user); // Garante que retorna usernames
  } catch (err) {
    console.error('Erro ao rodar scraping com Apify:', err);
    return [];
  }
}
