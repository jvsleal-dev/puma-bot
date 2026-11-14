const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');
// Substituir href do logo no header e no footer para /
html = html.split('<a class="flex items-center gap-2.5 group" href="/cadastro">').join('<a class="flex items-center gap-2.5 group" href="/">');
html = html.split('<a class="flex items-center gap-2 group" href="/cadastro">').join('<a class="flex items-center gap-2 group" href="/">');
fs.writeFileSync('public/index.html', html);

// Sincronizar +page.svelte
const start = html.indexOf('<body');
const bodyOpenEnd = html.indexOf('>', start);
const end = html.lastIndexOf('</body>');
const body = html.substring(bodyOpenEnd + 1, end);
fs.writeFileSync('src/routes/+page.svelte', '<svelte:head>\n  <title>Puma Bot — Gateway PIX & Automação de Alta Conversão no Telegram</title>\n</svelte:head>\n\n' + body);

console.log('Logo do header e footer apontando perfeitamente para /');

