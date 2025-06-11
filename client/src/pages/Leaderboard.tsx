"use client"

import type React from "react"
import axios from 'axios';
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import LoadingSkeleton from "../components/LoadingSkeleton"
import PlayerCard from "../components/LeaderboardPlayerCard"
import Navbar from "../components/Navbar";
import { Crown, Trophy, Target, Zap, Gamepad2, TrendingUp, Star, Sparkles } from "lucide-react"

interface Player {
  id: string
  u_rank: number
  username: string
  winPercentage: number
  ethEarned: number
  totalMatches: number
  wonMatches: number
}

const LeaderboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [players, setPlayers] = useState<Player[]>([])

  // Data Loading
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(async () => {
      await axios.get<Player[]>(
        `${import.meta.env.VITE_SERVER_API_URL}/leaderboard-data`,
        { withCredentials: true }
      ).then(res =>{
        console.log(res.data);
        setPlayers(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        console.log("ERROR, TRY REFRESH THE PAGE");
      })
    }, 800)
    return () => clearTimeout(timer)
  },[])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.3)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse"></div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-40"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 2,
            }}
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + i * 8}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full">
        <Navbar PageName="Leaderboard"/>
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-gradient-to-r from-gray-900/50 via-purple-900/30 to-gray-900/50 backdrop-blur-sm border-b border-gray-700/30 pt-24 pb-6"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <Crown className="w-12 h-12 text-yellow-400" fill="currentColor" />
              </motion.div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-cyber tracking-wider">
                LEADERBOARD
              </h1>
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
              >
                <Trophy className="w-12 h-12 text-cyan-400" />
              </motion.div>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">Top Players of the Arena</p>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="w-full py-6">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            {/* Desktop Table Header */}
            <div className="hidden md:grid md:grid-cols-6 md:gap-6 mb-6 px-6 py-4 bg-gray-800/30 backdrop-blur-sm border border-gray-600/20 rounded-2xl">
              <div className="flex items-center space-x-2 text-gray-400 font-semibold">
                <Target size={16} />
                <span>Rank</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 font-semibold">
                <Gamepad2 size={16} />
                <span>Player</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-400 font-semibold">
                <TrendingUp size={16} />
                <span>Win Rate</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-400 font-semibold">
                <Zap size={16} />
                <span>ETH Earned</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-400 font-semibold">
                <Star size={16} />
                <span>Matches</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-400 font-semibold">
                <Sparkles size={16} />
                <span>Won Matches</span>
              </div>
            </div>

            {/* Players List */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <LoadingSkeleton />
                </motion.div>
              ) : players.length > 0 ? (
                <motion.div
                  key="players"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {players.sort((a, b) => a.u_rank - b.u_rank).map((player, index) => (
                    <PlayerCard key={player.id} player={player} index={index} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-20"
                >
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-2xl font-bold text-gray-400 mb-2">No players yet!</h3>
                  <p className="text-gray-500">Be the first to compete and claim the top spot!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}

export default LeaderboardPage
