"use client";

import { useEffect, useState } from "react";
import sdk from "@farcaster/miniapp-sdk";
import TopEngagedCasts from "~/components/TopEngagedCasts";
import CastlyticsLanding from "~/components/CastlyticsLanding";

interface Cast {
  text: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  engagement: {
    likes: number;
    recasts: number;
    replies: number;
  };
  timestamp: string;
  totalEngagement: number;
  rank: number;
  hash: string;
  embeds: any[];
}

interface User {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [casts, setCasts] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Call sdk.actions.ready() when the app is loaded
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  // Handle successful sign-in
  const handleSignInSuccess = ({ fid, username }: { fid: number; username: string }) => {
    console.log('Authenticated with FID:', fid);
    
    const mockUser: User = {
      fid,
      username: username || `user_${fid}`,
      displayName: username || `User ${fid}`,
      pfpUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
    };
    
    setUser(mockUser);
  };

  // Handle sign-in button click
  const handleSignIn = () => {
    // This will be triggered by the CastlyticsLanding component's button
    // We'll use a mock sign-in for now since the actual button is in CastlyticsLanding
    const mockFid = 3; // dwr.eth's FID for testing
    const mockUsername = "dwr.eth";
    handleSignInSuccess({ fid: mockFid, username: mockUsername });
  };

  // Handle sign-out
  const handleSignOut = () => {
    setUser(null);
    setCasts([]);
    setError(null);
  };

  // Fetch user's casts when they sign in
  useEffect(() => {
    const fetchUserCasts = async () => {
      if (!user?.fid) {
        setCasts([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching casts for FID: ${user.fid}`);
        console.log(`API Key: ${process.env.NEXT_PUBLIC_NEYNAR_API_KEY ? 'Present' : 'Missing'}`);
        
        // Direct API call to Neynar with proper headers
        const response = await fetch(
          `https://api.neynar.com/v2/farcaster/feed?feed_type=filter&filter_type=fids&fids=${user.fid}&limit=50`,
          {
            headers: {
              'accept': 'application/json',
              'api_key': process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '',
              'x-neynar-experimental': 'true', // Use filtered data to match Warpcast
            },
          }
        );

        console.log(`Response status: ${response.status}`);
        console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error response:', errorText);
          throw new Error(`Failed to fetch casts: ${response.statusText} (${response.status}) - ${errorText}`);
        }

        const data = await response.json();
        console.log("Raw API Response:", JSON.stringify(data, null, 2));
        
        // Transform the casts to match our component interface
        const transformedCasts = data.casts
          .filter((cast: any) => cast.text) // Only include casts with text
          .map((cast: any) => {
            console.log('Full cast object:', JSON.stringify(cast, null, 2));
            
            // Check multiple possible paths for reactions data
            const reactions = cast.reactions || {};
            const likes = reactions.likes_count || 0;
            const recasts = reactions.recasts_count || 0;
            const replies = cast.replies?.count || 0;
            const totalEngagement = likes + recasts + replies;
            
            console.log(`Cast engagement breakdown:`);
            console.log(`- cast.reactions.likes_count: ${reactions.likes_count || 0}`);
            console.log(`- cast.reactions.recasts_count: ${reactions.recasts_count || 0}`);
            console.log(`- cast.replies.count: ${cast.replies?.count || 0}`);
            console.log(`Final engagement - likes: ${likes}, recasts: ${recasts}, replies: ${replies}, total: ${totalEngagement}`);
            
            // Check for embeds/images
            console.log(`Cast embeds:`, cast.embeds);
            
            return {
              text: cast.text,
              author: {
                name: cast.author.display_name || cast.author.username,
                username: cast.author.username,
                avatar: cast.author.pfp_url,
              },
              engagement: {
                likes,
                recasts,
                replies,
              },
              timestamp: cast.timestamp,
              totalEngagement,
              hash: cast.hash, // Add cast hash for Warpcast link
              embeds: cast.embeds || [], // Add embeds for images
            };
          })
          .sort((a: Cast, b: Cast) => b.totalEngagement - a.totalEngagement)
          .slice(0, 5)
          .map((cast: Cast, index: number) => ({
            ...cast,
            rank: index + 1,
          }));

        console.log("Transformed casts:", transformedCasts);
        setCasts(transformedCasts);
      } catch (err) {
        console.error("Error fetching casts:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch casts");
        setCasts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCasts();
  }, [user?.fid]);

  // Show loading state
  if (loading) {
    return (
      <CastlyticsLanding
        isSignedIn={false}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Analyzing your casts...</h2>
          <p className="text-gray-600">Finding your most engaged content</p>
        </div>
      </CastlyticsLanding>
    );
  }

  // Show error state
  if (error) {
    return (
      <CastlyticsLanding
        isSignedIn={false}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      >
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h2 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </CastlyticsLanding>
    );
  }

  // Use CastlyticsLanding component to wrap everything
  return (
    <CastlyticsLanding
      isSignedIn={!!user}
      username={user?.username}
      onSignIn={handleSignIn}
      onSignOut={handleSignOut}
    >
      {!user ? (
        // Sign-in prompt
        <div className="text-center">
          {/* Removed SignInButton */}
        </div>
      ) : (
        // Show TopEngagedCasts component when user is signed in and casts are loaded
        <TopEngagedCasts casts={casts} />
      )}
    </CastlyticsLanding>
  );
}