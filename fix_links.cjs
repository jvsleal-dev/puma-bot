const fs = require('fs');

const files = ['public/index.html', 'public/cadastro.html', 'public/login.html'];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Normalizar links de login e cadastro
    content = content.split('href="login.html"').join('href="/login"');
    content = content.split('href="cadastro.html"').join('href="/cadastro"');
    content = content.split('href="index.html"').join('href="/"');
    content = content.split('href="#"').join('href="/cadastro"');
    fs.writeFileSync(file, content);
  }
}

console.log('Links atualizados com sucesso.');

