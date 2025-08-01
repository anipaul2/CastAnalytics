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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Anime-style sparkles and shapes */}
        <div className="absolute top-20 left-20 text-yellow-300 text-2xl animate-bounce">✨</div>
        <div className="absolute top-32 right-32 text-pink-300 text-xl animate-pulse">💫</div>
        <div className="absolute bottom-32 left-16 text-cyan-300 text-3xl animate-spin" style={{animationDuration: '3s'}}>⭐</div>
        <div className="absolute bottom-20 right-20 text-purple-300 text-2xl animate-bounce delay-500">✦</div>
        <div className="absolute top-1/3 right-1/4 text-blue-300 text-xl animate-pulse delay-700">◆</div>
        <div className="absolute bottom-1/3 left-1/3 text-indigo-300 text-lg animate-bounce delay-300">●</div>
        <div className="absolute top-2/3 left-10 text-pink-400 text-2xl animate-pulse delay-1000">♦</div>
        <div className="absolute top-10 left-1/2 text-yellow-400 text-xl animate-bounce delay-800">▲</div>
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
                Your top casts, ranked
              </h2>
              <p className="text-lg md:text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
                See which casts hit different. Track your bangers and level up your Farcaster game.
              </p>
            </motion.div>


            {/* Content from children */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-center"
            >
              {children}
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