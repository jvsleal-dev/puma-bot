// ============================================================================
// Telegram Bot API Wrapper - High-Performance, Fail-Safe Native Fetch
// Timeout estrito de 8000ms com AbortSignal
// ============================================================================

export interface InlineKeyboardButton {
  text: string;
  url?: string;
  callback_data?: string;
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

export interface TelegramResponse<T = any> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
}

export interface ChatInviteLink {
  invite_link: string;
  creator: any;
  creates_join_request: boolean;
  is_primary: boolean;
  is_revoked: boolean;
  expire_date?: number;
  member_limit?: number;
}

/**
 * Executa chamadas à API do Telegram com timeout estrito de 8 segundos
 */
async function callTelegramApi<T = any>(
  botToken: string,
  method: string,
  body: Record<string, any>
): Promise<TelegramResponse<T>> {
  const url = `https://api.telegram.org/bot${botToken}/${method}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    const data: TelegramResponse<T> = await res.json();
    return data;
  } catch (error: any) {
    console.error(`[TelegramAPI Error] ${method}:`, error?.message || error);
    return {
      ok: false,
      description: error?.name === 'AbortError' ? 'Telegram API request timeout (8s)' : error?.message
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Envia mensagem de texto no Telegram com suporte a HTML e Inline Keyboard
 */
export async function sendTelegramMessage(
  botToken: string,
  chatId: string | number | bigint,
  text: string,
  replyMarkup?: InlineKeyboardMarkup
): Promise<TelegramResponse> {
  return callTelegramApi(botToken, 'sendMessage', {
    chat_id: chatId.toString(),
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: false,
    reply_markup: replyMarkup
  });
}

/**
 * Envia mídia (foto ou vídeo) com legenda em HTML e botões inline
 */
export async function sendTelegramMedia(
  botToken: string,
  chatId: string | number | bigint,
  mediaUrl: string,
  mediaType: 'photo' | 'video',
  caption: string,
  replyMarkup?: InlineKeyboardMarkup
): Promise<TelegramResponse> {
  const method = mediaType === 'video' ? 'sendVideo' : 'sendPhoto';
  const paramName = mediaType === 'video' ? 'video' : 'photo';

  return callTelegramApi(botToken, method, {
    chat_id: chatId.toString(),
    [paramName]: mediaUrl,
    caption,
    parse_mode: 'HTML',
    reply_markup: replyMarkup
  });
}

/**
 * Responde callback_query imediatamente para remover o estado de loading do botão no app do Telegram
 */
export async function answerCallbackQuery(
  botToken: string,
  callbackQueryId: string,
  text?: string,
  showAlert: boolean = false
): Promise<TelegramResponse> {
  return callTelegramApi(botToken, 'answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text,
    show_alert: showAlert
  });
}

/**
 * Cria link de convite descartável de uso único (member_limit: 1) e expiração de 24h
 * O link se autodestrói imediatamente quando o comprador entra no grupo/canal VIP
 */
export async function createSingleUseInviteLink(
  botToken: string,
  vipChatId: string,
  name: string = 'Acesso VIP Puma Bot'
): Promise<string | null> {
  const expireDate = Math.floor(Date.now() / 1000) + 86400; // 24 horas a partir de agora

  const res = await callTelegramApi<ChatInviteLink>(botToken, 'createChatInviteLink', {
    chat_id: vipChatId,
    name,
    expire_date: expireDate,
    member_limit: 1,
    creates_join_request: false
  });

  if (res.ok && res.result?.invite_link) {
    return res.result.invite_link;
  }

  console.error('[Telegram createInviteLink Failed]:', res.description);
  return null;
}

/**
 * Remove membro inadimplente/expirado do grupo VIP
 * Executa banChatMember seguido de unbanChatMember para expulsar permitindo recompra futura
 */
export async function kickExpiredMember(
  botToken: string,
  vipChatId: string,
  telegramUserId: string | number | bigint
): Promise<boolean> {
  const userId = telegramUserId.toString();

  // 1. Ban para expulsar imediatamente
  const banRes = await callTelegramApi(botToken, 'banChatMember', {
    chat_id: vipChatId,
    user_id: userId,
    revoke_messages: false
  });

  if (!banRes.ok) {
    console.warn(`[kickExpiredMember] Ban failed for user ${userId}:`, banRes.description);
  }

  // 2. Unban para remover da lista negra (permitindo que ele assine novamente)
  const unbanRes = await callTelegramApi(botToken, 'unbanChatMember', {
    chat_id: vipChatId,
    user_id: userId,
    only_if_banned: true
  });

  return banRes.ok || unbanRes.ok;
}

