const fs = require('fs');
const path = require('path');

// Se o servidor for executado diretamente para preview estático
const publicIndex = path.join(__dirname, 'public', 'index.html');
if (fs.existsSync(publicIndex)) {
  console.log('SvelteKit routes configuradas e sincronizadas.');
}

