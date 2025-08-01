"use client"

import { Crown, Medal, Trophy } from "lucide-react";

interface Cast {
  text: string
  author: {
    name: string
    username: string
    avatar: string
  }
  engagement: {
    likes: number
    recasts: number
    replies: number
  }
  timestamp: string
  totalEngagement: number
  rank: number
  hash: string
  embeds: any[]
}

interface TopEngagedCastsProps {
  casts: Cast[]
  totalCastsCount?: number
  username?: string
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-yellow-500" />
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />
    case 3:
      return <Trophy className="w-5 h-5 text-orange-500" />
    default:
      return <span className="text-lg font-bold text-gray-600">{rank}</span>
  }
}

const getRankBorderColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "border-yellow-400" // Gold for #1
    case 2:
      return "border-orange-400" // Orange for #2 (was gray)
    case 3:
      return "border-gray-400" // Gray for #3 (was orange)
    case 4:
      return "border-blue-400"
    case 5:
      return "border-purple-400"
    default:
      return "border-gray-300"
  }
}

const getRankBadgeColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-500 to-yellow-600"
    case 2:
      return "bg-gradient-to-r from-orange-500 to-orange-600"
    case 3:
      return "bg-gradient-to-r from-gray-500 to-gray-600"
    case 4:
      return "bg-gradient-to-r from-blue-500 to-blue-600"
    case 5:
      return "bg-gradient-to-r from-purple-500 to-purple-600"
    default:
      return "bg-gradient-to-r from-gray-500 to-gray-600"
  }
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    return "Just now"
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }
}

const formatFullTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getWarpcastUrl = (hash: string) => {
  return `https://warpcast.com/~/conversations/${hash}`
}

const getYouTubeEmbedUrl = (url: string) => {
  // Extract video ID from various YouTube URL formats
  const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1];
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return null;
}

const cleanCastText = (text: string) => {
  // Remove YouTube URLs from the text since they're embedded as videos
  return text.replace(/\s*https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[^\s]*/gi, '').trim();
}

export default function TopEngagedCasts({ casts, totalCastsCount = 0, username }: TopEngagedCastsProps) {
  if (!casts || casts.length === 0) {
    // Different messages based on user's casting activity
    let emoji = "📊";
    let title = "No casts found";
    let message = "Start posting to see your analytics here!";

    if (totalCastsCount === 0) {
      emoji = "🤔";
      title = "Mehhh be active more!";
      message = `Hey @${username || 'anon'}, looks like you haven't cast yet. Time to share your thoughts with the world! 🚀`;
    } else if (totalCastsCount <= 5) {
      emoji = "📈";
      title = "Cast more fren, you can do it!";
      message = `You've got ${totalCastsCount} cast${totalCastsCount === 1 ? '' : 's'} but need more activity to see analytics. Keep casting and watch your engagement grow! 💪`;
    } else if (totalCastsCount >= 10) {
      emoji = "😅";
      title = "Need more engagement, fren!";
      message = `You've posted ${totalCastsCount} casts but they're not getting much love. Try engaging with others first, use trending topics, or post when your audience is most active! 🔥`;
    } else {
      emoji = "😅";
      title = "No engagement yet";
      message = "Your casts need some love! Try posting at peak times or engaging with the community first.";
    }

    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-12 border border-purple-100 text-center">
          <div className="text-6xl mb-6">{emoji}</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
          <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">{message}</p>
          
          {totalCastsCount === 0 && (
            <div className="mt-8">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 max-w-sm mx-auto">
                <div className="text-purple-600 font-semibold mb-2">Pro tip:</div>
                <div className="text-purple-700 text-sm">
                  Start with introducing yourself, share your interests, or comment on trending topics!
                </div>
              </div>
            </div>
          )}
          
          {totalCastsCount > 0 && totalCastsCount <= 5 && (
            <div className="mt-8">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-6 max-w-sm mx-auto">
                <div className="text-blue-600 font-semibold mb-2">Keep going!</div>
                <div className="text-blue-700 text-sm">
                  Post regularly, engage with others, and your analytics will start showing up soon.
                </div>
              </div>
            </div>
          )}
          
          {totalCastsCount >= 10 && (
            <div className="mt-8">
              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-6 max-w-sm mx-auto">
                <div className="text-orange-600 font-semibold mb-2">Engagement tips:</div>
                <div className="text-orange-700 text-sm">
                  Reply to trending casts, ask questions, share hot takes, and engage authentically with the community!
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Get user info from the first cast (since all casts are from the same user)
  const user = casts[0]?.author

  // Calculate total engagement across all casts
  const totalEngagement = casts.reduce((sum, cast) => sum + cast.totalEngagement, 0)

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* User Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-purple-100">
        <div className="flex items-center gap-6">
          {/* User Avatar */}
          <div className="relative">
            <img
              src={user?.avatar || "/placeholder.svg?height=64&width=64"}
              alt={user?.name || "User"}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg"
            />
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h1>
            <p className="text-gray-600 mb-4 text-lg">@{user?.username}</p>
            <div className="flex items-center gap-4">
              <span className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-purple-700 font-medium">
                Top {casts.length} Casts
              </span>
              <span className="bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full text-blue-700 font-medium">
                {formatNumber(totalEngagement)} Total Engagement
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Casts List */}
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Most Engaged Casts</h2>
          <p className="text-white/90 font-semibold text-lg">Your top performing content ranked by engagement</p>
        </div>

        {casts.map((cast, index) => (
          <div
            key={`cast-${cast.rank}-${index}`}
            className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${getRankBorderColor(
              cast.rank,
            )} ${cast.rank === 1 ? "ring-2 ring-yellow-300" : ""}`}
          >
            <div className="p-8">
              {/* Rank and Timestamp */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getRankIcon(cast.rank)}
                  <span className="text-sm text-gray-500 font-medium">{formatTimestamp(cast.timestamp)}</span>
                  <a href={getWarpcastUrl(cast.hash)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors" title={formatFullTimestamp(cast.timestamp)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Cast Text */}
              <p className="text-gray-800 mb-6 leading-relaxed text-lg">{cleanCastText(cast.text)}</p>

              {/* Cast Images and Videos */}
              {cast.embeds && cast.embeds.length > 0 && (
                <div className="mb-6">
                  {/* Collect all images and videos first */}
                  {(() => {
                    const allImages: any[] = [];
                    const allVideos: any[] = [];
                    
                    cast.embeds.forEach((embed: any, embedIndex: number) => {
                      console.log(`Processing embed ${embedIndex}:`, embed);
                      
                      // Look for embeds with url and image metadata
                      if (embed.url && embed.metadata?.content_type?.startsWith('image/')) {
                        allImages.push({ url: embed.url });
                        console.log('Added image:', embed.url);
                      }
                      // Look for video embeds
                      else if (embed.url && embed.metadata?.content_type?.startsWith('video/')) {
                        allVideos.push({ url: embed.url, type: embed.metadata?.content_type || 'video' });
                        console.log('Added video:', embed.url);
                      }
                      // Look for YouTube URLs in text/html embeds
                      else if (embed.url && embed.metadata?.content_type === 'text/html;charset=utf-8' && 
                               (embed.url.includes('youtube.com') || embed.url.includes('youtu.be'))) {
                        console.log('Found YouTube embed:', embed);
                        console.log('YouTube embed metadata:', embed.metadata);
                        console.log('YouTube embed HTML:', embed.metadata?.html);
                        console.log('YouTube oembed HTML:', embed.metadata?.html?.oembed?.html);
                        
                        const embedUrl = getYouTubeEmbedUrl(embed.url);
                        if (embedUrl) {
                          allVideos.push({ 
                            url: embedUrl, 
                            type: 'youtube',
                            embedHtml: null // We'll create the iframe manually
                          });
                          console.log('Created video object with embedUrl:', embedUrl);
                        } else {
                          console.log('Could not extract YouTube video ID from:', embed.url);
                        }
                      }
                      // Look for embeds with type "image"
                      else if (embed.type === "image" && embed.url) {
                        allImages.push({ url: embed.url });
                      }
                      // Direct images array
                      else if (embed.images && Array.isArray(embed.images)) {
                        allImages.push(...embed.images);
                      }
                      // URL that might be an image
                      else if (embed.url && (embed.url.includes('.jpg') || embed.url.includes('.jpeg') || embed.url.includes('.png') || embed.url.includes('.gif') || embed.url.includes('.webp'))) {
                        allImages.push({ url: embed.url });
                      }
                      // Image property
                      else if (embed.image) {
                        allImages.push({ url: embed.image });
                      }
                    });
                    
                    console.log(`Final - Images: ${allImages.length}, Videos: ${allVideos.length}`);
                    console.log('All videos:', allVideos);
                    
                    return (
                      <>
                        {/* All Images in a single row */}
                        {allImages.length > 0 && (
                          <div className="flex gap-3 overflow-x-auto mb-4">
                            {allImages.map((image: any, imageIndex: number) => (
                              <img
                                key={imageIndex}
                                src={image.url}
                                alt="Cast image"
                                className="w-64 h-64 rounded-xl object-cover flex-shrink-0 shadow-md"
                                onError={(e) => {
                                  console.log(`Failed to load image: ${image.url}`);
                                  e.currentTarget.style.display = 'none';
                                }}
                                onLoad={() => {
                                  console.log(`Successfully loaded image: ${image.url}`);
                                }}
                              />
                            ))}
                          </div>
                        )}
                        
                        {/* All Videos */}
                        {allVideos.length > 0 && (
                          <div className="space-y-3">
                            {allVideos.map((video: any, videoIndex: number) => {
                              console.log(`Rendering video ${videoIndex}:`, video);
                              return (
                                <div key={videoIndex} className="relative">
                                  {video.type === 'youtube' ? (
                                    <iframe
                                      src={video.url}
                                      width="100%"
                                      height="100%"
                                      style={{ border: 0 }}
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      className="w-full h-64 rounded-xl shadow-md"
                                      title="YouTube video player"
                                    />
                                  ) : (
                                    <video
                                      src={video.url}
                                      controls
                                      className="w-full h-64 rounded-xl shadow-md"
                                      onError={(e) => {
                                        console.log(`Failed to load video: ${video.url}`);
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Engagement Metrics */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors cursor-pointer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="font-semibold">{formatNumber(cast.engagement.likes)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors cursor-pointer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className="font-semibold">{formatNumber(cast.engagement.recasts)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors cursor-pointer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="font-semibold">{formatNumber(cast.engagement.replies)}</span>
                  </div>
                </div>

                {/* Total Engagement Badge */}
                <div className={`px-4 py-2 rounded-full font-bold text-white ${getRankBadgeColor(cast.rank)}`}>
                  {formatNumber(cast.totalEngagement)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
