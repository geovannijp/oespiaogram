// scrape-followers.js

export async function scrapeFollowers(username) {
  const APIFY_TOKEN = 'pDLV1dxKF0g86AZQi'; // ⚠️ substitua!
  const ACTOR_ID = 'apify/instagram-scraper';

  try {
    const runResponse = await fetch(`https://api.apify.com/v2/actor-tasks/${ACTOR_ID}/runs?token=${APIFY_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        resultsLimit: 100
      })
    });

    const runData = await runResponse.json();

    const { data } = runData;
    const { id: runId } = data;

    // Espera a execução do actor terminar
    let runStatus = 'RUNNING';
    while (runStatus === 'RUNNING') {
      const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`);
      const statusJson = await statusRes.json();
      runStatus = statusJson.data.status;
      if (runStatus === 'SUCCEEDED') break;
      await new Promise(r => setTimeout(r, 3000));
    }

    // Busca os resultados
    const datasetRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}&clean=true`);
    const dataset = await datasetRes.json();

    // Extrai a lista de seguidores (ou o que estiver disponível)
    const followers = dataset[0]?.followers || [];

    return followers.map(f => f.username);
  } catch (error) {
    console.error('Erro ao usar o Apify:', error);
    return [];
  }
}
