import type React from "react"

interface Player {
  username: string
  avatar: string
  walletAddress: string
}

const PlayerCard: React.FC<{ player: Player; isOpponent?: boolean }> = ({ player, isOpponent }) => (
    <div
      className={`flex items-center space-x-2 p-3 bg-gray-800/50 backdrop-blur-sm border rounded-xl ${
        isOpponent ? "border-pink-500/30" : "border-cyan-500/30"
      }`}
    >
      <div className="relative">
        <div
          className={`w-10 h-10 bg-gradient-to-r ${
            isOpponent ? "from-pink-500 to-purple-500" : "from-cyan-500 to-blue-500"
          } rounded-full flex items-center justify-center text-lg`}
        >
          {player.avatar}
        </div>
        <div
          className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 bg-green-500"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate text-sm">{player.username}</h3>
        <p className="text-xs text-gray-400 truncate">{player.walletAddress}</p>
        <p
          className="text-xs text-green-400">
          Active
        </p>
      </div>
    </div>
  )

export default PlayerCard
