import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Redirect to the main app
    return NextResponse.json({
      success: true,
      redirectUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    });
  } catch (error) {
    console.error('Error in share endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to process share request' },
      { status: 500 }
    );
  }
} 