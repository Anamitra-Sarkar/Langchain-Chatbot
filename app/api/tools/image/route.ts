import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Mock image generation
    // In production, this would call DALL-E, Stable Diffusion, or another image generation API
    const mockImageUrl = `https://via.placeholder.com/512x512.png?text=${encodeURIComponent(prompt.substring(0, 20))}`;

    return NextResponse.json({
      imageUrl: mockImageUrl,
      prompt,
      note: 'This is a mock image. Configure an image generation API key to generate real images.',
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Image generation failed' },
      { status: 500 }
    );
  }
}
