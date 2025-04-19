// scrape-followers.js

export async function scrapeFollowers(username) {
  const APIFY_TOKEN = 'apify_api_a1TA0riNUXUbIjnhUMfFRPJ2VeX6e12VOh08'; // substitua!
  const ACTOR_ID = 'apify/instagram-scraper'; // você está usando esse

  try {
    // Roda o Actor
    const runResponse = await fetch(`https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username
      })
    });

    const runData = await runResponse.json();
    const runId = runData.data.id;

    // Espera até que o Actor finalize
    let status = 'RUNNING';
    while (status === 'RUNNING') {
      const statusCheck = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`);
      const statusData = await statusCheck.json();
      status = statusData.data.status;
      if (status !== 'RUNNING') break;
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Busca os dados do dataset do run
    const datasetResponse = await fetch(`https://api.apify.com/v2/datasets/${runId}/items?token=${APIFY_TOKEN}&clean=true&format=json`);
    const dataset = await datasetResponse.json();

    const result = dataset[0];

    // Extrai o número de seguidores e seguidos
    return {
      followersCount: result.followersCount,
      followsCount: result.followsCount,
      fullName: result.fullName,
      username: result.username
    };

  } catch (error) {
    console.error('Erro ao rodar scraping com Apify:', error);
    return null;
  }
}
