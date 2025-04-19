export async function scrapeFollowers(username) {
  const token = process.env.APIFY_TOKEN || 'apify_api_a1TA0riNUXUbIjnhUMfFRPJ2VeX6e12VOh08';
  console.log(`[Scrape] Iniciando scraping para ${username}...`);
  try {
    console.log('[Scrape] Enviando requisição para iniciar run...');
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
    console.log('[Scrape] Resposta do startRun:', JSON.stringify(runData, null, 2));
    if (!runData.data?.id) {
      console.error('[Scrape] Erro: Nenhum runId retornado');
      return [];
    }
    const runId = runData.data.id;
    let isFinished = false;
    let runResult = null;
    console.log('[Scrape] Aguardando conclusão do run ID:', runId);
    while (!isFinished) {
      const checkStatus = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
      runResult = await checkStatus.json();
      console.log('[Scrape] Status do run:', runResult.data.status);
      isFinished = runResult.data.status === 'SUCCEEDED';
      if (runResult.data.status === 'FAILED' || runResult.data.status === 'TIMED_OUT') {
        console.error('[Scrape] Run falhou ou expirou:', runResult.data.status);
        return [];
      }
      if (!isFinished) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    const datasetId = runResult.data.defaultDatasetId;
    console.log('[Scrape] Dataset ID:', datasetId);
    if (!datasetId) {
      console.error('[Scrape] Erro: Nenhum datasetId retornado');
      return [];
    }
    console.log('[Scrape] Buscando dados do dataset...');
    const datasetRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&clean=true`);
    const dataset = await datasetRes.json();
    console.log('[Scrape] Dados do dataset:', JSON.stringify(dataset, null, 2));
    const followers = dataset[0]?.followers || [];
    console.log('[Scrape] Seguidores encontrados:', followers);
    return followers.map(user => user.username || user);
  } catch (err) {
    console.error('[Scrape] Erro ao rodar scraping com Apify:', err.message);
    return [];
  }
}
