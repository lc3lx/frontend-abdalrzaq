// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://www.sushiluha.com";

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  login: `${API_BASE_URL}/api/login`,
  register: `${API_BASE_URL}/api/register`,
  user: `${API_BASE_URL}/api/user`,
  
  // Social Media Auth
  facebookAuth: `${API_BASE_URL}/api/facebook/auth`,
  whatsappAuth: `${API_BASE_URL}/api/whatsapp/auth`,
  whatsappQuickSetup: `${API_BASE_URL}/api/whatsapp/quick-setup`,
  whatsappTestMessage: `${API_BASE_URL}/api/whatsapp/test-message`,
  whatsappStatus: `${API_BASE_URL}/api/whatsapp/status`,
  whatsappDisconnect: `${API_BASE_URL}/api/whatsapp/disconnect`,
  
  // Accounts
  accounts: `${API_BASE_URL}/api/accounts`,
  disconnectAccount: (platform) => `${API_BASE_URL}/api/accounts/${platform}`,
  
  // Posts
  post: `${API_BASE_URL}/api/post`,
  schedulePost: `${API_BASE_URL}/api/schedule-post`,
  scheduledPosts: `${API_BASE_URL}/api/scheduled-posts`,
  publishedPosts: `${API_BASE_URL}/api/posts/published`,
  syncEngagement: `${API_BASE_URL}/api/posts/sync-engagement`,
  
  // Messages
  messages: `${API_BASE_URL}/api/messages`,
  messageStats: `${API_BASE_URL}/api/messages/stats`,
  replyMessage: (messageId) => `${API_BASE_URL}/api/messages/${messageId}/reply`,
  
  // Auto Reply
  autoReplyFlows: `${API_BASE_URL}/api/auto-reply/flows`,
  autoReplyFlow: (flowId) => `${API_BASE_URL}/api/auto-reply/flows/${flowId}`,
  toggleFlow: (flowId) => `${API_BASE_URL}/api/auto-reply/flows/${flowId}/toggle`,
  
  // Wallet
  wallet: `${API_BASE_URL}/api/wallet`,
  walletRecharge: `${API_BASE_URL}/api/wallet/recharge`,
  walletTransactions: `${API_BASE_URL}/api/wallet/transactions`,
  
  // Packages
  packages: `${API_BASE_URL}/api/packages`,
  mySubscription: `${API_BASE_URL}/api/packages/my-subscription`,
  purchasePackage: (packageId) => `${API_BASE_URL}/api/packages/purchase/${packageId}`,
  
  // Admin
  adminStats: `${API_BASE_URL}/api/admin/dashboard/stats`,
  
  // Upload
  uploadImage: `${API_BASE_URL}/api/upload/image`,
  uploadMedia: `${API_BASE_URL}/api/upload/media`,
};
