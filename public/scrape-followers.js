export async function scrapeFollowers(username) {
  const token = process.env.APIFY_TOKEN || 'apify_api_a1TA0riNUXUbIjnhUMfFRPJ2VeX6e12VOh08';
  console.log(`Iniciando scraping para ${username}...`);
  try {
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
    console.log('Resposta do startRun:', runData);
    if (!runData.data?.id) {
      console.error('Erro: Nenhum runId retornado');
      return [];
    }
    const runId = runData.data.id;
    let isFinished = false;
    let runResult = null;
    while (!isFinished) {
      const checkStatus = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
      runResult = await checkStatus.json();
      console.log('Status do run:', runResult.data.status);
      isFinished = runResult.data.status === 'SUCCEEDED';
      if (!isFinished) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    const datasetId = runResult.data.defaultDatasetId;
    console.log('Dataset ID:', datasetId);
    const datasetRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&clean=true`);
    const dataset = await datasetRes.json();
    console.log('Dados do dataset:', dataset);
    const followers = dataset[0]?.followers || [];
    console.log('Seguidores encontrados:', followers);
    return followers.map(user => user.username || user);
  } catch (err) {
    console.error('Erro ao rodar scraping com Apify:', err.message);
    return [];
  }
}
