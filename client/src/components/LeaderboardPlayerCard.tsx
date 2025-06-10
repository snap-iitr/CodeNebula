import type React from "react"
import { motion } from "framer-motion"
import { Crown, Trophy, Award } from "lucide-react"

interface Player {
  id: string
  u_rank: number
  username: string
  winPercentage: number
  ethEarned: number
  totalMatches: number
  wonMatches: number
}

const PlayerCard: React.FC<{ player: Player; index: number }> = ({ player, index }) => {

    const getRankIcon = (u_rank: number) => {
        switch (u_rank) {
        case 1:
            return <Crown className="w-6 h-6 text-yellow-400" fill="currentColor" />
        case 2:
            return <Trophy className="w-6 h-6 text-gray-300" />
        case 3:
            return <Award className="w-6 h-6 text-orange-400"/>
        default:
            return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">{u_rank}</span>
        }
    }

    const getRankGlow = (u_rank: number) => {
        switch (u_rank) {
        case 1:
            return "shadow-yellow-500/20 border-yellow-500/30 hover:border-yellow-400/50"
        case 2:
            return "shadow-gray-300/20 border-gray-300/30 hover:border-gray-200/50"
        case 3:
            return "shadow-orange-500/20 border-orange-500/30 hover:border-orange-400/50"
        default:
            return "shadow-purple-500/10 border-gray-600/30 hover:border-purple-500/50"
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`group relative p-6 bg-gray-800/50 backdrop-blur-sm border rounded-2xl transition-all duration-300 hover:shadow-2xl ${getRankGlow(player.u_rank)}`}
        >
            {/* Glow effect for top 3 */}
            {player.u_rank <= 3 && (
            <div
                className={`absolute inset-0 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${
                player.u_rank === 1
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                    : player.u_rank === 2
                    ? "bg-gradient-to-r from-gray-300 to-gray-500"
                    : "bg-gradient-to-r from-orange-500 to-red-500"
                }`}
            ></div>
            )}

            <div className="relative z-10">
            {/* Mobile Layout */}
            <div className="block md:hidden space-y-4">
                <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                    {getRankIcon(player.u_rank)}
                    </div>
                    <div>
                    <h3 className="font-bold text-white">{player.username}</h3>
                    </div>
                </div>
                {/* <div className="text-2xl">{player.avatar}</div> */}
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                    <div className="text-lg font-bold text-green-400">{player.winPercentage}%</div>
                    <div className="text-xs text-gray-400">Win Rate</div>
                </div>
                <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                    <div className="text-lg font-bold text-cyan-400">{player.ethEarned} ETH</div>
                    <div className="text-xs text-gray-400">Earned</div>
                </div>
                </div>

                <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                <div className="text-lg font-bold text-purple-400">{player.totalMatches}</div>
                <div className="text-xs text-gray-400">Total Matches</div>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-6 md:items-center md:gap-6">
                <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12">{getRankIcon(player.u_rank)}</div>
                {/* <span className="text-2xl">{player.avatar}</span> */}
                </div>

                <div>
                <h3 className="font-bold text-white">{player.username}</h3>
                </div>

                <div className="text-center">
                <div className="text-xl font-bold text-green-400">{player.winPercentage}%</div>
                <div className="text-xs text-gray-400">Win Rate</div>
                </div>

                <div className="text-center">
                <div className="text-xl font-bold text-cyan-400">{player.ethEarned} ETH</div>
                <div className="text-xs text-gray-400">Earned</div>
                </div>

                <div className="text-center">
                <div className="text-xl font-bold text-purple-400">{player.totalMatches}</div>
                <div className="text-xs text-gray-400">Matches</div>
                </div>

                <div className="text-center">
                <div className="text-xl font-bold text-yellow-400">{player.wonMatches}</div>
                <div className="text-xs text-gray-400">Matches Won</div>
                </div>
            </div>
            </div>
        </motion.div>
    );
}

export default PlayerCard