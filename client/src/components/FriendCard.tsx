import type React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router";
import { Zap, MessageCircle } from "lucide-react"

interface Friend {
  id: string
  username: string
  walletAddress: string
  avatar: string
  gamesWon: number
  gamesPlayed: number
}

const FriendCard: React.FC<{ friend: Friend }> = ({ friend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="group relative p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                {friend.avatar}
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 bg-green-500"
              ></div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">{friend.username}</h3>
              <p className="text-sm text-gray-400 font-mono">{friend.walletAddress}</p>
              <p className="text-xs text-gray-500 mt-1">
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">Win Rate</div>
            <div className="text-lg font-bold text-cyan-400">
              {Math.round((friend.gamesWon! / friend.gamesPlayed!) * 100)}%
            </div>
            <div className="text-xs text-gray-500">
              {friend.gamesWon}/{friend.gamesPlayed} games
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Link to={`/profile/${friend.id}`}
            className="flex-1 flex items-center justify-center space-x-2 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
          >
            <Zap size={16} />
            <span>View Profile</span>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center p-2 bg-gray-700/50 border border-gray-600/30 rounded-xl hover:border-gray-500/50 transition-colors"
          >
            <MessageCircle size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )

  export default FriendCard;