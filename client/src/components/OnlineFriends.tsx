import type React from "react"
import { MessageCircle } from "lucide-react"

const OnlineFriends: React.FC = () => {
  const friends = [
    { id: 1, name: "CryptoKing", avatar: "👑", online: true },
    { id: 2, name: "EthMaster", avatar: "⚡", online: true },
    { id: 3, name: "BlockChainer", avatar: "🔗", online: false },
    { id: 4, name: "GameLord", avatar: "🎮", online: true },
    { id: 5, name: "CoinHunter", avatar: "🏹", online: false },
    { id: 6, name: "NFTCollector", avatar: "🎨", online: true },
  ]

  const onlineFriends = friends.filter((friend) => friend.online)

  return (
    <section className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent font-cyber tracking-wider">
          ONLINE FRIENDS ({onlineFriends.length})
        </h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border border-green-500/30 rounded-lg hover:border-green-400/50 transition-colors">
          <MessageCircle size={16} />
          <span className="text-sm">Chat</span>
        </button>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className={`flex-shrink-0 relative p-4 bg-gray-800/50 backdrop-blur-sm border rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer ${
              friend.online
                ? "border-green-500/30 hover:border-green-400/50"
                : "border-gray-600/30 hover:border-gray-500/50"
            }`}
          >
            <div className="flex flex-col items-center space-y-2 min-w-[80px]">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xl">
                  {friend.avatar}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                    friend.online ? "bg-green-500" : "bg-gray-500"
                  }`}
                ></div>
              </div>
              <span className="text-sm font-medium text-center">{friend.name}</span>
              {friend.online && <span className="text-xs text-green-400">Online</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default OnlineFriends
