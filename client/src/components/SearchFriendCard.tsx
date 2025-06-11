import type React from "react"
import axios from 'axios';
import { motion } from "framer-motion"
import { UserPlus } from "lucide-react"

interface SearchResult {
  id: string
  username: string
  walletAddress: string
  avatar: string
}

interface SearchFriendCardProps {
  result: SearchResult
  onChange: () => void
}

const SearchFriendCard: React.FC<SearchFriendCardProps> = ({ result , onChange }) => {

  const handleAddFriend = async () => {
    // Logic to add the friend
    await axios.post<string>(
        `${import.meta.env.VITE_SERVER_API_URL}/add-friend`,
        { FriendId: result.id },
        { withCredentials: true }
      ).then(res => {
        // Handle successful response
        console.log("Friend added successfully:", res.data);
        onChange();
      }).catch(err => {
        // Handle error
        console.error("Error loading friends data:", err);
      });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl">
            {result.avatar}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{result.username}</h3>
            <p className="text-sm text-gray-400 font-mono">{result.walletAddress}</p>
          </div>
        </div>

        <motion.button
          onClick={handleAddFriend}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
        >
          <UserPlus size={16} />
          <span>Add Friend</span>
        </motion.button>
      </div>
    </motion.div>
  )

}

  export default SearchFriendCard;