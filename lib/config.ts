export const config = {
  // Auth
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  nextAuthSecret: process.env.NEXTAUTH_SECRET || 'development-secret-change-in-production',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

  // AI Providers
  openaiApiKey: process.env.OPENAI_API_KEY,
  huggingfaceApiKey: process.env.HUGGINGFACEHUB_API_TOKEN,

  // Database
  databaseUrl: process.env.DATABASE_URL,
  kvUrl: process.env.KV_REST_API_URL,
  kvToken: process.env.KV_REST_API_TOKEN,

  // Tools
  tavilyApiKey: process.env.TAVILY_API_KEY,

  // Features
  enableMockProvider: !process.env.OPENAI_API_KEY && !process.env.HUGGINGFACEHUB_API_TOKEN,
  
  // Rate Limiting
  rateLimitPerMinute: parseInt(process.env.RATE_LIMIT_PER_MINUTE || '20', 10),
  rateLimitPerHour: parseInt(process.env.RATE_LIMIT_PER_HOUR || '100', 10),
}

export function getAvailableProviders() {
  const providers: string[] = [];
  
  if (config.openaiApiKey) {
    providers.push('openai');
  }
  
  if (config.huggingfaceApiKey) {
    providers.push('huggingface');
  }
  
  if (providers.length === 0 || config.enableMockProvider) {
    providers.push('mock');
  }
  
  return providers;
}

export function getDefaultProvider(): string {
  const providers = getAvailableProviders();
  
  // Prefer OpenAI, then HuggingFace, then mock
  if (providers.includes('openai')) {
    return 'openai';
  }
  
  if (providers.includes('huggingface')) {
    return 'huggingface';
  }
  
  return 'mock';
}
