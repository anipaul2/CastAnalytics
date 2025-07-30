"use client";

import { useEffect, useState } from "react";
import { useMiniApp } from "@neynar/react";
import TopEngagedCasts from "~/components/TopEngagedCasts";

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

/**
 * HomeTab component displays the main landing content for the mini app.
 * 
 * This is the default tab that users see when they first open the mini app.
 * It shows the user's top 5 most engaged casts when they are signed in.
 * 
 * @example
 * ```tsx
 * <HomeTab />
 * ```
 */
export function HomeTab() {
  const { context } = useMiniApp();
  const [casts, setCasts] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCasts = async () => {
      if (!context?.user?.fid) {
        setCasts([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/casts?fid=${context.user.fid}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCasts(data.casts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch casts');
        setCasts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCasts();
  }, [context?.user?.fid]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] px-6">
        <div className="text-center w-full max-w-md mx-auto">
          <div className="spinner h-8 w-8 mx-auto mb-4"></div>
          <p className="text-lg mb-2">Loading your top casts...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Neynar 🪐</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] px-6">
        <div className="text-center w-full max-w-md mx-auto">
          <p className="text-lg mb-2 text-red-600">Error loading casts</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!context?.user?.fid) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] px-6">
        <div className="text-center w-full max-w-md mx-auto">
          <p className="text-lg mb-2">Sign in to see your top casts!</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Neynar 🪐</p>
        </div>
      </div>
    );
  }

  // Show TopEngagedCasts component when user is signed in and casts are loaded
  return <TopEngagedCasts casts={casts} />;
} 