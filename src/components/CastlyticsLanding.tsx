"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "~/components/ui/Button"

interface CastlyticsLandingProps {
  isSignedIn: boolean
  username?: string
  onSignOut: () => void
  children: React.ReactNode
}

export default function CastlyticsLanding({
  isSignedIn,
  username,
  onSignOut,
  children,
}: CastlyticsLandingProps) {
  const features = [
    {
      icon: "📊",
      title: "Track your top performing casts",
      description: "See which casts get the most engagement and reach",
    },
    {
      icon: "💡",
      title: "Understand what content resonates",
      description: "Discover patterns in your most successful content",
    },
    {
      icon: "🚀",
      title: "Improve your casting strategy",
      description: "Use insights to craft better, more engaging casts",
    },
    {
      icon: "🎯",
      title: "Connect better with your audience",
      description: "Build stronger relationships through targeted content",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <AnimatePresence mode="wait">
        {!isSignedIn ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col justify-center"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mb-6">
                Castlytics
              </h1>
              <h2 className="text-2xl md:text-4xl font-semibold text-white mb-4">
                Know what resonates before you cast
              </h2>
              <p className="text-lg md:text-xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
                Discover which of your casts sparked the most engagement. Understand your audience&apos;s preferences, refine
                your content strategy, and craft casts that truly connect. Because great content starts with
                understanding what works.
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                  className="group"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-purple-300/30 transition-all duration-300">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-purple-100 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Loading state for authentication */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Connecting to Farcaster...</h2>
              <p className="text-purple-100">Getting your profile</p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 container mx-auto px-4 py-12 min-h-screen"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
            >
              <div>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mb-2">
                  Castlytics
                </h1>
                <p className="text-xl text-purple-100">
                  Welcome back, <span className="text-white font-semibold">@{username}</span>! 👋
                </p>
              </div>
              <Button
                onClick={onSignOut}
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              >
                Sign Out
              </Button>
            </motion.div>

            {/* Dashboard Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 