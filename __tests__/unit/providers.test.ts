import { ProviderFactory, OpenAIProvider, MockProvider } from '@/lib/ai/providers';

describe('AI Providers', () => {
  it('should create OpenAI provider', () => {
    const provider = ProviderFactory.getProvider('openai');
    expect(provider).toBeInstanceOf(OpenAIProvider);
    expect(provider.getName()).toBe('openai');
  });

  it('should create Mock provider', () => {
    const provider = ProviderFactory.getProvider('mock');
    expect(provider).toBeInstanceOf(MockProvider);
    expect(provider.getName()).toBe('mock');
  });

  it('should always have mock provider available', () => {
    const provider = new MockProvider();
    expect(provider.isAvailable()).toBe(true);
  });

  it('should get default provider', () => {
    const provider = ProviderFactory.getDefaultProvider();
    expect(provider).toBeDefined();
    expect(provider.getName()).toBeDefined();
  });

  it('should invoke mock provider', async () => {
    const provider = new MockProvider();
    const response = await provider.invoke('Hello');
    expect(response).toContain('mock AI assistant');
  });
});
