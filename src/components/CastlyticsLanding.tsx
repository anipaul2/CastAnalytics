"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "~/components/ui/Button"

interface CastlyticsLandingProps {
  isSignedIn: boolean
  username?: string
  onSignIn: () => void
  onSignOut: () => void
  children: React.ReactNode
}

export default function CastlyticsLanding({
  isSignedIn,
  username,
  onSignIn,
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
      <div className="absolute inset-0">
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

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-center"
            >
              {children}
              </motion.div>
              <Button
                onClick={onSignIn}
                className="bg-[#855DCD] hover:bg-[#7248B8] text-white px-12 py-6 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 border-2 border-purple-400/30 hover:border-purple-300/50"
              >
                <motion.span whileHover={{ scale: 1.05 }} className="flex items-center gap-4">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 1000 1000"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0 text-white"
                  >
                    <path
                      d="M257.778 155.556H742.222V844.444H671.111V528.889H670.414C662.554 430.106 589.258 353.333 500 353.333C410.742 353.333 337.446 430.106 329.586 528.889H328.889V844.444H257.778V155.556Z"
                      fill="currentColor"
                    />
                    <path
                      d="M128.889 253.333L157.778 351.111H182.222V746.667C182.222 774.756 177.064 795.111 166.747 807.733C156.431 820.356 143.772 826.667 128.772 826.667H71.1111V920H128.772C168.050 920 199.689 906.489 223.689 879.467C247.689 852.444 259.689 812.756 259.689 760.400V351.111H284.133L313.022 253.333H128.889Z"
                      fill="currentColor"
                    />
                    <path
                      d="M688.889 746.667V351.111H713.333L742.222 253.333H558.089L586.978 351.111H611.422V760.400C611.422 812.756 623.422 852.444 647.422 879.467C671.422 906.489 703.061 920 742.339 920H800V826.667H742.339C727.006 826.667 714.347 820.356 704.031 807.733C693.714 795.111 688.556 774.756 688.556 746.667H688.889Z"
                      fill="currentColor"
                    />
                  </svg>
                  Sign in with Farcaster
                </motion.span>
              </Button>
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