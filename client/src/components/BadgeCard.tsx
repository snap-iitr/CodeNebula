import type React from "react"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"

interface Badge {
  name: string
  icon: React.ReactNode
  description: string
  earned: boolean
}

const BadgeCard: React.FC<{
    badge: Badge
    index: number
  }> = ({ badge, index }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.1, y: -5 }}
      className={`group relative flex-shrink-0 p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
        badge.earned
          ? "bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-400/50"
          : "bg-gray-800/30 border border-gray-600/20"
      }`}
      title={badge.description}
    >
      {/* Glow effect for earned badges */}
      {badge.earned && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
      )}

      <div className="relative z-10 flex flex-col items-center space-y-2 min-w-[80px]">
        <div
          className={`p-3 rounded-xl ${
            badge.earned ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white" : "bg-gray-700 text-gray-500"
          }`}
        >
          {badge.earned ? badge.icon : <Lock className="w-6 h-6" />}
        </div>
        <span className={`text-xs font-medium text-center ${badge.earned ? "text-white" : "text-gray-500"}`}>
          {badge.name}
        </span>
      </div>
    </motion.div>
  )

  export default BadgeCard