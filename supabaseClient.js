const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pokrzxuzurjjtcrnkgvl.supabase.co'; // <-- substitua aqui
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBva3J6eHV6dXJqanRjcm5rZ3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNDAzOTIsImV4cCI6MjA1OTgxNjM5Mn0.q9J4AhLDFSOqAWqQnIE1dsqLMxZO8dCTBzQUarLVhLg'; // <-- substitua aqui

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
