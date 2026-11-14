const fs = require('fs');

const pages = [
  'public/dashboard.html',
  'public/robos.html',
  'public/fluxos.html',
  'public/clientes.html',
  'public/gateways.html'
];

for (const p of pages) {
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    const links = html.match(/href="([^"]*)"/gi) || [];
    console.log(`Page: ${p}`);
    links.forEach(l => {
      if (l.includes('dashboard') || l.includes('robo') || l.includes('fluxo') || l.includes('cliente') || l.includes('gateway')) {
        console.log(`  ${l}`);
      }
    });
  }
}
