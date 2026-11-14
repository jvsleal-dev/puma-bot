// -----------------------------------------------------------------------------
// Puma Bot - Application Configuration & Environment Fallbacks
// -----------------------------------------------------------------------------

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/puma_bot?schema=public",
  DIRECT_URL: process.env.DIRECT_URL || "postgresql://postgres:password@localhost:5432/puma_bot?schema=public",
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "mock_token_dev",
  TELEGRAM_WEBHOOK_SECRET: process.env.TELEGRAM_WEBHOOK_SECRET || "puma_secret_token_change_in_production_32chars",
  PIX_GATEWAY_PROVIDER: process.env.PIX_GATEWAY_PROVIDER || "PUSHINPAY",
  PIX_GATEWAY_TOKEN: process.env.PIX_GATEWAY_TOKEN || "mock_token_dev",
  PIX_GATEWAY_WEBHOOK_SECRET: process.env.PIX_GATEWAY_WEBHOOK_SECRET || "mock_wh_secret",
  CRON_SECRET: process.env.CRON_SECRET || "puma_cron_token_long_random_alphanumeric_here",
  APP_URL: process.env.APP_URL || "http://localhost:3000"
};

