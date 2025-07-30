import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const _body = await request.json();
  
  return NextResponse.json({
    redirectUrl: process.env.NEXT_PUBLIC_APP_URL || "https://castanalytics.vercel.app",
  });
} 