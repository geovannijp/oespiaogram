import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pokrzxuzurjjtcrnkgvl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBva3J6eHV6dXJqanRjcm5rZ3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNDAzOTIsImV4cCI6MjA1OTgxNjM5Mn0.q9J4AhLDFSOqAWqQnIE1dsqLMxZO8dCTBzQUarLVhLg'; // Sua chave completa
const supabase = createClient(supabaseUrl, supabaseKey);

export async function scrapeFollowers(username) {
  const token = process.env.APIFY_TOKEN || 'apify_api_a1TA0riNUXUbIjnhUMfFRPJ2VeX6e12VOh08';
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
    const runId = runData.data.id;
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
    const datasetId = runResult.data.defaultDatasetId;
    const datasetRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&clean=true`);
    const dataset = await datasetRes.json();
    const followers = dataset[0]?.followers || [];

    // Exemplo de uso do Supabase
    const { data, error } = await supabase
      .from('followers')
      .insert([{ username, followers: followers.map(user => user.username || user) }]);
    if (error) {
      console.error('Erro ao salvar followers no Supabase:', error.message);
    }

    return followers.map(user => user.username || user);
  } catch (err) {
    console.error('Erro ao rodar scraping com Apify:', err);
    return [];
  }
}
