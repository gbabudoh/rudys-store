import { NextRequest, NextResponse } from 'next/server';
import { Chatbot } from '@/lib/chatbot';
import { getAllProducts } from '@/lib/products';

// Optional API route for server-side chatbot processing
// Currently not used, but available for future enhancements like:
// - Logging conversations to database
// - Analytics tracking
// - Rate limiting
// - Server-side product filtering

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const chatbot = new Chatbot();
    const products = getAllProducts();
    const response = await chatbot.processMessage(message, products);

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Log conversation for analytics
// Uncomment and implement when you want to track conversations
/*
async function logConversation(message: string, response: string) {
  // TODO: Implement database logging
  // Example:
  // await db.query(
  //   'INSERT INTO chat_logs (user_message, bot_response, timestamp) VALUES (?, ?, ?)',
  //   [message, response, new Date()]
  // );
}
*/
