import type React from "react"
import axios from 'axios';
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

interface FriendRequest {
  id: string
  username: string
  walletAddress: string
  avatar: string
}

interface RequestCardProps {
  request: FriendRequest
  onChange: () => void
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onChange }) =>{

  const handleRequest = async (value : boolean) => {
    // Logic to accept the friend request
    await axios.post<string>(
        `${import.meta.env.VITE_SERVER_API_URL}/request-friend`,
        { requestId: request.id , value },
        { withCredentials: true }
      ).then(res => {
        // Handle successful response
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
      className="p-6 bg-gray-800/50 backdrop-blur-sm border border-yellow-500/30 rounded-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-xl">
            {request.avatar}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{request.username}</h3>
            <p className="text-sm text-gray-400 font-mono">{request.walletAddress}</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <motion.button
          onClick={() => handleRequest(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 flex items-center justify-center space-x-2 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-green-500/25 transition-all duration-200"
        >
          <Check size={16} />
          <span>Accept</span>
        </motion.button>

        <motion.button
          onClick={() => handleRequest(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 flex items-center justify-center space-x-2 py-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200"
        >
          <X size={16} />
          <span>Reject</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

  export default RequestCard;