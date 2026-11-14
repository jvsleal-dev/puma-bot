const fs = require('fs');

function analyzeFile(file) {
  console.log(`\n=================== ANALYZING: ${file} ===================`);
  const content = fs.readFileSync(file, 'utf8');

  // 1. Formulários
  const forms = content.match(/<form[\s\S]*?<\/form>/gi) || [];
  console.log(`Formulários encontrados: ${forms.length}`);
  forms.forEach((form, idx) => {
    console.log(`-- Form ${idx + 1}:`);
    const actionMatch = form.match(/action="([^"]*)"/i);
    const methodMatch = form.match(/method="([^"]*)"/i);
    const onsubmitMatch = form.match(/onsubmit="([^"]*)"/i);
    console.log(`   action: ${actionMatch ? actionMatch[1] : 'NONE'}`);
    console.log(`   method: ${methodMatch ? methodMatch[1] : 'NONE'}`);
    console.log(`   onsubmit: ${onsubmitMatch ? onsubmitMatch[1] : 'NONE'}`);
  });

  // 2. Inputs
  const inputs = content.match(/<input[^>]*>/gi) || [];
  console.log(`Inputs encontrados: ${inputs.length}`);
  inputs.forEach((input, idx) => {
    const typeMatch = input.match(/type="([^"]*)"/i);
    const nameMatch = input.match(/name="([^"]*)"/i);
    const idMatch = input.match(/id="([^"]*)"/i);
    console.log(`   Input ${idx + 1}: type="${typeMatch ? typeMatch[1] : 'text'}", name="${nameMatch ? nameMatch[1] : 'NONE'}", id="${idMatch ? idMatch[1] : 'NONE'}"`);
  });

  // 3. Botões de Ação
  const buttons = content.match(/<button[^>]*>[\s\S]*?<\/button>/gi) || [];
  console.log(`Botões encontrados: ${buttons.length}`);
  buttons.forEach((btn, idx) => {
    const text = btn.replace(/<[^>]*>/g, '').trim().replace(/\s+/g, ' ');
    const typeMatch = btn.match(/type="([^"]*)"/i);
    const onclickMatch = btn.match(/onclick="([^"]*)"/i);
    console.log(`   Button ${idx + 1}: type="${typeMatch ? typeMatch[1] : 'button'}", text="${text.substring(0, 40)}", onclick="${onclickMatch ? onclickMatch[1] : 'NONE'}"`);
  });

  // 4. Scripts executáveis
  const scripts = content.match(/<script[\s\S]*?<\/script>/gi) || [];
  console.log(`Scripts JS encontrados: ${scripts.length}`);
}

analyzeFile('public/index.html');
analyzeFile('public/cadastro.html');
analyzeFile('public/login.html');

