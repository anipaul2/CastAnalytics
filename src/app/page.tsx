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
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  // Initialize SDK
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        await sdk.actions.ready();
        console.log('SDK initialized');
      } catch (err) {
        console.error('Failed to initialize SDK:', err);
      }
    };
    initializeSDK();
  }, []);

  // Handle authentication with proper error handling and retries
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const authenticateUser = async () => {
      try {
        console.log(`Authentication attempt ${retryCount + 1}/${maxRetries}`);
        setIsAuthenticating(true);
        
        // Wait a bit for SDK to be fully ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get the Quick Auth token
        const { token } = await sdk.quickAuth.getToken();
        
        if (!token) {
          throw new Error('No authentication token received');
        }
        
        console.log('Quick Auth token received');
        
        // Decode the JWT to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        const fid = parseInt(payload.sub);
        
        if (!fid || isNaN(fid)) {
          throw new Error('Invalid FID in token');
        }
        
        console.log('Extracted FID:', fid);
        
        // Fetch user profile from Neynar
        try {
          const userResponse = await fetch(
            `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
            {
              headers: {
                'accept': 'application/json',
                'api_key': process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '',
              },
            }
          );

          if (userResponse.ok) {
            const userData = await userResponse.json();
            const userInfo = userData.users?.[0];
            
            if (userInfo && isMounted) {
              setUser({
                fid: userInfo.fid,
                username: userInfo.username,
                displayName: userInfo.display_name,
                pfpUrl: userInfo.pfp_url,
              });
              console.log('User profile loaded:', userInfo.username);
            }
          } else {
            // Fallback user data if profile fetch fails
            if (isMounted) {
              setUser({
                fid: fid,
                username: `user_${fid}`,
                displayName: `User ${fid}`,
                pfpUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
              });
            }
          }
        } catch (profileError) {
          console.warn('Failed to fetch user profile, using fallback:', profileError);
          // Use fallback user data
          if (isMounted) {
            setUser({
              fid: fid,
              username: `user_${fid}`,
              displayName: `User ${fid}`,
              pfpUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
            });
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Authentication error:', err);
        
        if (retryCount < maxRetries - 1 && isMounted) {
          retryCount++;
          console.log(`Retrying authentication in 2 seconds...`);
          setTimeout(() => {
            if (isMounted) {
              authenticateUser();
            }
          }, 2000);
        } else if (isMounted) {
          setError('Failed to authenticate. Please refresh and try again.');
        }
      } finally {
        if (isMounted) {
          setIsAuthenticating(false);
        }
      }
    };

    authenticateUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle sign-out
  const handleSignOut = () => {
    setUser(null);
    setCasts([]);
    setError(null);
    // In a real app, you might want to clear the auth token here
  };

  // Fetch user's casts when authenticated
  useEffect(() => {
    let isMounted = true;

    const fetchUserCasts = async () => {
      if (!user?.fid || isAuthenticating) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching casts for user @${user.username} (FID: ${user.fid})`);
        
        // Fetch user's casts from Neynar
        const response = await fetch(
          `https://api.neynar.com/v2/farcaster/feed?feed_type=filter&filter_type=fids&fids=${user.fid}&limit=50`,
          {
            headers: {
              'accept': 'application/json',
              'api_key': process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '',
              'x-neynar-experimental': 'true',
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch casts: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log(`Fetched ${data.casts?.length || 0} casts`);
        
        if (!data.casts || data.casts.length === 0) {
          if (isMounted) {
            setCasts([]);
          }
          return;
        }

        // Transform and sort casts by engagement
        const transformedCasts = data.casts
          .filter((cast: any) => cast.text && cast.text.trim().length > 0)
          .map((cast: any) => {
            const reactions = cast.reactions || {};
            const likes = reactions.likes_count || 0;
            const recasts = reactions.recasts_count || 0;
            const replies = cast.replies?.count || 0;
            const totalEngagement = likes + recasts + replies;
            
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
              hash: cast.hash,
              embeds: cast.embeds || [],
            };
          })
          .sort((a: Cast, b: Cast) => b.totalEngagement - a.totalEngagement)
          .slice(0, 5)
          .map((cast: Cast, index: number) => ({
            ...cast,
            rank: index + 1,
          }));

        console.log(`Showing top ${transformedCasts.length} casts by engagement`);
        
        if (isMounted) {
          setCasts(transformedCasts);
        }
      } catch (err) {
        console.error("Error fetching casts:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch casts");
          setCasts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserCasts();

    return () => {
      isMounted = false;
    };
  }, [user?.fid, isAuthenticating]);

  // Show authentication loading state
  if (isAuthenticating) {
    return (
      <CastlyticsLanding
        isSignedIn={false}
        onSignOut={handleSignOut}
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Connecting to Farcaster...</h2>
          <p className="text-purple-100">Authenticating your account</p>
        </div>
      </CastlyticsLanding>
    );
  }

  // Show error state
  if (error && !loading) {
    return (
      <CastlyticsLanding
        isSignedIn={!!user}
        username={user?.username}
        onSignOut={handleSignOut}
      >
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Reload App
          </button>
        </div>
      </CastlyticsLanding>
    );
  }

  // Show loading state while fetching casts
  if (loading) {
    return (
      <CastlyticsLanding
        isSignedIn={true}
        username={user?.username}
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

  // Main app UI
  return (
    <CastlyticsLanding
      isSignedIn={!!user}
      username={user?.username}
      onSignOut={handleSignOut}
    >
      <TopEngagedCasts casts={casts} />
    </CastlyticsLanding>
  );
}