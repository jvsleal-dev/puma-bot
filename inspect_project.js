const { callMCP, PROJECT_NAME } = require('./stitch_client');
const fs = require('fs');

async function main() {
  try {
    console.log("Consultando telas existentes no projeto...");
    const res = await callMCP('list_screens', { project: PROJECT_NAME });
    console.log("Resultado list_screens:");
    fs.writeFileSync('screens_debug.json', JSON.stringify(res, null, 2));
    console.log("Salvo em screens_debug.json");
  } catch (err) {
    console.error("Erro:", err);
  }
}

main();

