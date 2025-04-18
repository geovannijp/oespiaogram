import { createClient } from '@supabase/supabase-js';
import { getApiKey } from './get-api-key.js';

// 🔌 Configurar Supabase
const supabase = createClient(
  'https://pokrzxuzurjjtcrnkgvl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBva3J6eHV6dXJqanRjcm5rZ3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNDAzOTIsImV4cCI6MjA1OTgxNjM5Mn0.q9J4AhLDFSOqAWqQnIE1dsqLMxZO8dCTBzQUarLVhLg'
);

// 📥 Função principal que faz o scraping
export async function scrapeInstagramPage(username) {
  try {
    const apiKey = await getApiKey(supabase);

    const response = await fetch(`https://api.webscrapingapi.com/v1?api_key=${apiKey}&url=https://www.instagram.com/${username}/&render_js=1`);

    if (!response.ok) {
      throw new Error('Erro na chamada da API');
    }

    const html = await response.text();
    return html;

  } catch (error) {
    console.error('Erro ao fazer scraping:', error);
    return null;
  }
}
