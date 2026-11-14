// ============================================================================
// Core Domain Models & Entities
// ============================================================================

export type SaleStatus = 'PENDING' | 'PAID' | 'EXPIRED' | 'REFUNDED';
export type GatewayProvider = 'PUSHINPAY' | 'MERCADOPAGO' | 'ASAAS' | 'EFI';
export type MediaType = 'PHOTO' | 'VIDEO';

export interface Plan {
  id: string;
  title: string;
  price: number;
  durationDays: number;
}

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  pixKey?: string | null;
  gatewayProvider?: GatewayProvider | null;
  gatewayToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BotEntity {
  id: string;
  userId: string;
  name: string;
  username: string;
  botToken: string;
  webhookSecret: string;
  vipChatId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlowEntity {
  id: string;
  botId: string;
  welcomeMessage: string;
  mediaUrl?: string | null;
  mediaType?: MediaType | null;
  plans: Plan[];
  remarketingMsg?: string | null;
  downsellPrice?: number | null;
  updatedAt: Date;
}

export interface SaleEntity {
  id: string;
  botId: string;
  telegramUserId: bigint;
  telegramUsername?: string | null;
  telegramFirstName?: string | null;
  planId: string;
  planName: string;
  durationDays: number;
  amount: number;
  pixTxid: string;
  pixCopyPaste: string;
  status: SaleStatus;
  paidAt?: Date | null;
  expiresAt: Date;
  createdAt: Date;
}

export interface VipSubscriptionEntity {
  id: string;
  saleId: string;
  botId: string;
  telegramUserId: bigint;
  chatId: string;
  inviteLink: string;
  expiresAt: Date;
  active: boolean;
  createdAt: Date;
}
