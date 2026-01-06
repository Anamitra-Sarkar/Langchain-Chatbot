import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

// In-memory canvas storage (would use database in production)
const canvasStore = new Map<string, any>();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID required' },
        { status: 400 }
      );
    }

    const canvasData = canvasStore.get(conversationId) || {
      drawings: [],
      notes: [],
    };

    return NextResponse.json({ canvasData });
  } catch (error) {
    console.error('Get canvas error:', error);
    return NextResponse.json(
      { error: 'Failed to get canvas' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { conversationId, canvasData } = await req.json();

    if (!conversationId || !canvasData) {
      return NextResponse.json(
        { error: 'Conversation ID and canvas data required' },
        { status: 400 }
      );
    }

    canvasStore.set(conversationId, canvasData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save canvas error:', error);
    return NextResponse.json(
      { error: 'Failed to save canvas' },
      { status: 500 }
    );
  }
}
