import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const apiKey = process.env.NEYNAR_API_KEY;
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get('fid');
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Neynar API key is not configured. Please add NEYNAR_API_KEY to your environment variables.' },
      { status: 500 }
    );
  }

  if (!fid) {
    return NextResponse.json(
      { error: 'FID parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Use direct API call to fetch user's casts
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/casts?fid=${fid}&limit=50`,
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.statusText}`);
    }

    const { casts } = await response.json() as { casts: any[] };

    // Transform the casts to match our TopEngagedCasts component interface
    const transformedCasts = casts.map((cast: any) => ({
      text: cast.text,
      author: {
        name: cast.author.display_name || cast.author.username,
        username: cast.author.username,
        avatar: cast.author.pfp_url,
      },
      engagement: {
        likes: cast.reactions?.likes?.length || 0,
        recasts: cast.reactions?.recasts?.length || 0,
        replies: cast.replies?.count || 0,
      },
      timestamp: cast.timestamp,
      totalEngagement: (cast.reactions?.likes?.length || 0) + 
                      (cast.reactions?.recasts?.length || 0) + 
                      (cast.replies?.count || 0),
    }));

    // Sort by total engagement and get top 5
    const topCasts = transformedCasts
      .sort((a, b) => b.totalEngagement - a.totalEngagement)
      .slice(0, 5)
      .map((cast, index) => ({
        ...cast,
        rank: index + 1,
      }));

    return NextResponse.json({ casts: topCasts });
  } catch (error) {
    console.error('Failed to fetch casts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch casts. Please check your Neynar API key and try again.' },
      { status: 500 }
    );
  }
} 