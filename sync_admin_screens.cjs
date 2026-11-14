const fs = require('fs');

const routes = [
  { file: 'stitch_puma_bot_telegram_pix_saas/puma_bot_gateway_automa_o_pix_telegram/code.html', out: 'public/dashboard.html' },
  { file: 'stitch_puma_bot_telegram_pix_saas/puma_bot_meus_rob_s_gest_o_de_bots_telegram/code.html', out: 'public/robos.html' },
  { file: 'stitch_puma_bot_telegram_pix_saas/puma_bot_meus_fluxos_construtor_de_funil_telegram/code.html', out: 'public/fluxos.html' },
  { file: 'stitch_puma_bot_telegram_pix_saas/puma_bot_pend_ncias_clientes_recupera_o_de_vendas/code.html', out: 'public/clientes.html' },
  { file: 'stitch_puma_bot_telegram_pix_saas/puma_bot_gateways_pagamentos_pix/code.html', out: 'public/gateways.html' }
];

routes.forEach(r => {
  if (fs.existsSync(r.file)) {
    let content = fs.readFileSync(r.file, 'utf8');
    // Normalizar links comuns da sidebar
    content = content.split('href="#dashboard"').join('href="/dashboard"');
    content = content.split('href="#robos"').join('href="/robos"');
    content = content.split('href="#fluxos"').join('href="/fluxos"');
    content = content.split('href="#clientes"').join('href="/clientes"');
    content = content.split('href="#gateways"').join('href="/gateways"');
    content = content.split('href="#sair"').join('href="/login"');
    content = content.split('href="#login"').join('href="/login"');
    content = content.split('href="#cadastro"').join('href="/cadastro"');
    content = content.split('href="#home"').join('href="/"');
    fs.writeFileSync(r.out, content);
    console.log('Gerado com sucesso:', r.out);
  }
});
