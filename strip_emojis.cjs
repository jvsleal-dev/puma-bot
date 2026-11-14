const fs = require('fs');
const path = require('path');

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1FA70}-\u{1FAFF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F900}-\u{1F9FF}]/gu;

function cleanEmojisInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const matches = content.match(emojiRegex);
  if (matches && matches.length > 0) {
    content = content.replace(emojiRegex, '');
    content = content.replace(/  +/g, ' ');
    fs.writeFileSync(filePath, content);
    console.log(`Removidos ${matches.length} emojis em: ${filePath}`);
  }
}

function scanAndClean(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== '.git' && item !== '.svelte-kit') {
        scanAndClean(fullPath);
      }
    } else if (
      item.endsWith('.html') ||
      item.endsWith('.svelte') ||
      item.endsWith('.ts') ||
      item.endsWith('.js')
    ) {
      cleanEmojisInFile(fullPath);
    }
  }
}

console.log('Varrendo public e src...');
scanAndClean('public');
scanAndClean('src');
cleanEmojisInFile('server.js');
console.log('Concluído com sucesso!');
