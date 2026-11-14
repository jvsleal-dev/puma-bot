const fs = require('fs');

function inspect(file) {
  console.log('=== ' + file + ' ===');
  const html = fs.readFileSync(file, 'utf8');
  const regex = /<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].replace(/<[^>]*>/g, '').trim().replace(/\s+/g, ' ');
    console.log(`href: "${href}" | text: "${text.substring(0, 60)}"`);
  }
}

inspect('public/index.html');
inspect('public/cadastro.html');
inspect('public/login.html');

