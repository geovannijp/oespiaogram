import { createClient } from "@supabase/supabase-js";

// Configurações do seu Supabase
const supabaseUrl = 'https://pokrzxuzurjjtcrnkgvl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBva3J6eHV6dXJqanRjcm5rZ3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNDAzOTIsImV4cCI6MjA1OTgxNjM5Mn0.q9J4AhLDFSOqAWqQnIE1dsqLMxZO8dCTBzQUarLVhLg'; // ⛔️ Trocar já!
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getApiKey() {
  try {
    const { data, error } = await supabase
      .from('config')
      .select('chave_api')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      throw new Error('Chave da API não encontrada');
    }

    return data[0].chave_api;
  } catch (err) {
    console.error("Erro ao buscar chave da API:", err);
    return null;
  }
}
