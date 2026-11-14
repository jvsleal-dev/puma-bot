const fs = require('fs');

const html = fs.readFileSync('public/index.html', 'utf8');
const sections = html.match(/<section[\s\S]*?<\/section>/gi) || [];
console.log('Total sections:', sections.length);
sections.forEach((sec, i) => {
  const idMatch = sec.match(/id="([^"]*)"/i);
  const h2Match = sec.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  console.log(`Section ${i+1}: id="${idMatch ? idMatch[1] : 'NONE'}" | Title="${h2Match ? h2Match[1].replace(/<[^>]*>/g, '').trim().substring(0, 60) : 'NONE'}"`);
});

