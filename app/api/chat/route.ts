import { ProviderFactory, generateMockStreamingResponse } from '@/lib/ai/providers';
import { db } from '@/lib/db';
import { getDefaultProvider } from '@/lib/config';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // For edge runtime, we'll allow anonymous users
    // In production, you'd implement JWT verification here
    const userId = 'anonymous';

    const { message, conversationId, provider } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize message to prevent prompt injection
    const sanitizedMessage = message.trim();
    if (sanitizedMessage.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message cannot be empty' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get or create conversation
    let convId = conversationId;
    if (!convId) {
      const title = sanitizedMessage.substring(0, 50) + (sanitizedMessage.length > 50 ? '...' : '');
      const conversation = await db.createConversation(userId, title);
      convId = conversation.id;
    }

    // Save user message
    await db.createMessage(convId, 'user', sanitizedMessage);

    // Get provider
    const providerName = provider || getDefaultProvider();
    const aiProvider = ProviderFactory.getProvider(providerName);

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = '';

          if (aiProvider.getName() === 'mock') {
            // Use mock streaming
            for await (const chunk of generateMockStreamingResponse(sanitizedMessage)) {
              fullResponse += chunk;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk, done: false })}\n\n`));
            }
          } else {
            // Use real AI provider
            try {
              const content = await aiProvider.invoke(sanitizedMessage);
              
              // Simulate streaming
              const words = content.split(' ');
              for (const word of words) {
                const chunk = word + ' ';
                fullResponse += chunk;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk, done: false })}\n\n`));
                await new Promise(resolve => setTimeout(resolve, 50));
              }
            } catch (error: any) {
              console.error('AI Provider Error:', error);
              // Fallback to mock on error
              for await (const chunk of generateMockStreamingResponse(sanitizedMessage)) {
                fullResponse += chunk;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk, done: false })}\n\n`));
              }
            }
          }

          // Save assistant message
          const assistantMessage = await db.createMessage(convId as string, 'assistant', fullResponse.trim(), {
            provider: aiProvider.getName(),
          });

          // Send completion with metadata
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                messageId: assistantMessage.id,
                conversationId: convId,
              })}\n\n`
            )
          );

          controller.close();
        } catch (error: any) {
          console.error('Streaming error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                error: 'Failed to generate response',
                done: true,
              })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
