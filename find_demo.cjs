const fs = require('fs');

const html = fs.readFileSync('public/index.html', 'utf8');
const d = html.indexOf('Ver Demonstração');
console.log('Index of Ver Demonstração:', d);
if (d !== -1) {
  console.log(html.substring(d - 120, d + 300));
}

