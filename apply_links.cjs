const fs = require('fs');

function updateLinks(file) {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  // No index.html:
  // href="#login" -> href="/login"
  // href="#register" -> href="/cadastro"
  // Logo: href="/cadastro" -> href="/"
  html = html.replace(/href="#login"/g, 'href="/login"');
  html = html.replace(/href="#register"/g, 'href="/cadastro"');
  html = html.replace(/href="#cadastro"/g, 'href="/cadastro"');
  
  // No cadastro.html:
  // href="#login" -> href="/login"
  // No login.html:
  // href="#cadastro" -> href="/cadastro"

  fs.writeFileSync(file, html);
  console.log(`Links atualizados em: ${file}`);
}

// Atualizar arquivos na pasta public/
updateLinks('public/index.html');
updateLinks('public/cadastro.html');
updateLinks('public/login.html');

// Ajustar logo na home para apontar para /
let indexHtml = fs.readFileSync('public/index.html', 'utf8');
// Encontrar link do logo e apontar para /
indexHtml = indexHtml.replace(/<a\s+class="flex items-center gap-3"[^>]*href="[^"]*"/g, '<a class="flex items-center gap-3" href="/"');
fs.writeFileSync('public/index.html', indexHtml);

// Atualizar também nos arquivos das rotas do SvelteKit
function extractBody(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const start = content.indexOf('<body');
  const bodyOpenEnd = content.indexOf('>', start);
  const end = content.lastIndexOf('</body>');
  return content.substring(bodyOpenEnd + 1, end);
}

fs.writeFileSync('src/routes/+page.svelte', '<svelte:head>\n  <title>Puma Bot — Gateway PIX & Automação de Alta Conversão no Telegram</title>\n</svelte:head>\n\n' + extractBody('public/index.html'));
fs.writeFileSync('src/routes/cadastro/+page.svelte', '<svelte:head>\n  <title>Puma Bot — Cadastro de Nova Conta</title>\n</svelte:head>\n\n' + extractBody('public/cadastro.html'));
fs.writeFileSync('src/routes/login/+page.svelte', '<svelte:head>\n  <title>Puma Bot — Login de Operadores</title>\n</svelte:head>\n\n' + extractBody('public/login.html'));

console.log('Todas as páginas e rotas SvelteKit foram sincronizadas com os links corretos!');

