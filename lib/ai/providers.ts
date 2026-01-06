export abstract class AIProvider {
  abstract getName(): string;
  abstract isAvailable(): boolean;
  abstract invoke(prompt: string): Promise<string>;
}

export class OpenAIProvider extends AIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  getName(): string {
    return 'openai';
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async invoke(prompt: string): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';
  }
}

export class HuggingFaceProvider extends AIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  getName(): string {
    return 'huggingface';
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async invoke(prompt: string): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('HuggingFace API key not configured');
    }

    // Using DialoGPT for better conversational responses
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data[0]?.generated_text || 'No response generated';
  }
}

export class MockProvider extends AIProvider {
  getName(): string {
    return 'mock';
  }

  isAvailable(): boolean {
    return true;
  }

  async invoke(prompt: string): Promise<string> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return `I'm a mock AI assistant. This response is generated for development purposes when no API keys are configured. Your message was: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}" To use real AI providers, please configure OPENAI_API_KEY or HUGGINGFACEHUB_API_TOKEN environment variables. I can help you test the streaming functionality of this chat platform!`;
  }
}

export class ProviderFactory {
  static getProvider(name: string, config?: { openaiKey?: string; huggingfaceKey?: string }): AIProvider {
    switch (name) {
      case 'openai':
        return new OpenAIProvider(config?.openaiKey || process.env.OPENAI_API_KEY || '');
      case 'huggingface':
        return new HuggingFaceProvider(config?.huggingfaceKey || process.env.HUGGINGFACEHUB_API_TOKEN || '');
      case 'mock':
        return new MockProvider();
      default:
        throw new Error(`Provider ${name} not found`);
    }
  }

  static getAvailableProviders(config?: { openaiKey?: string; huggingfaceKey?: string }): AIProvider[] {
    const providers: AIProvider[] = [];
    
    const openai = new OpenAIProvider(config?.openaiKey || process.env.OPENAI_API_KEY || '');
    if (openai.isAvailable()) {
      providers.push(openai);
    }
    
    const huggingface = new HuggingFaceProvider(config?.huggingfaceKey || process.env.HUGGINGFACEHUB_API_TOKEN || '');
    if (huggingface.isAvailable()) {
      providers.push(huggingface);
    }
    
    if (providers.length === 0) {
      providers.push(new MockProvider());
    }
    
    return providers;
  }

  static getDefaultProvider(config?: { openaiKey?: string; huggingfaceKey?: string }): AIProvider {
    const openaiKey = config?.openaiKey || process.env.OPENAI_API_KEY;
    const huggingfaceKey = config?.huggingfaceKey || process.env.HUGGINGFACEHUB_API_TOKEN;
    
    // Prefer OpenAI, then HuggingFace, then mock
    if (openaiKey) {
      return new OpenAIProvider(openaiKey);
    }
    
    if (huggingfaceKey) {
      return new HuggingFaceProvider(huggingfaceKey);
    }
    
    return new MockProvider();
  }
}

// Mock streaming response generator
export async function* generateMockStreamingResponse(prompt: string): AsyncGenerator<string> {
  const responses = [
    "I'm a mock AI assistant. ",
    "This response is generated for development purposes when no API keys are configured. ",
    "Your message was: \"" + prompt.substring(0, 50) + (prompt.length > 50 ? "..." : "") + "\" ",
    "To use real AI providers, please configure OPENAI_API_KEY or HUGGINGFACEHUB_API_TOKEN environment variables. ",
    "I can help you test the streaming functionality of this chat platform!"
  ];

  for (const chunk of responses) {
    yield chunk;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
