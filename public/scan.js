import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 🔑 Sua URL e Anon Key:
const supabaseUrl = 'https://pokrzxuzurjjtcrnkgvl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBva3J6eHV6dXJqanRjcm5rZ3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNDAzOTIsImV4cCI6MjA1OTgxNjM5Mn0.q9J4AhLDFSOqAWqQnIE1dsqLMxZO8dCTBzQUarLVhLg'

const supabase = createClient(supabaseUrl, supabaseKey)

document.getElementById('checkBtn').addEventListener('click', async () => {
  const usernameInput = document.getElementById('usernameInput')
  const username = usernameInput.value.trim()

  if (!username) {
    alert('Digite seu @ do Instagram.')
    return
  }

  // Simulando verificação
  const resultados = [
    '@usuario_inativo',
    '@nao_te_segue',
    '@curioso'
  ]

  const resultArea = document.getElementById('resultArea')
  resultArea.innerHTML = '<strong>Esses perfis não te seguem de volta:</strong><ul>' +
    resultados.map(user => `<li>${user}</li>`).join('') +
    '</ul>'

  // Salva username no Supabase
  await supabase.from('usuarios').insert([{ username_instagram: username }])
})

document.getElementById('notifyBtn').addEventListener('click', async () => {
  const username = document.getElementById('usernameInput').value.trim()
  const whatsapp = document.getElementById('whatsappInput').value.trim()

  if (!username || !whatsapp) {
    alert('Preencha os dois campos.')
    return
  }

  // Salva no Supabase
  const { error } = await supabase.from('usuarios').insert([
    { username_instagram: username, numero_whatsapp: whatsapp }
  ])

  if (error) {
    alert('Erro ao salvar. Tente novamente.')
    console.error(error)
  } else {
    alert('Você será notificado via WhatsApp quando alguém deixar de te seguir!')
  }
})
