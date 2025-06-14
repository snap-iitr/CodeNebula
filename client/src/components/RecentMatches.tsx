import type React from "react"
import { Trophy, X, Clock, Equal} from "lucide-react"
import { useEffect } from "react"
import axios from 'axios';
import { useState } from "react";

type Match = {
  id: number;
  opponent_username: string;
  winner_id: number;
  stake_amount: string;
  completed_at: string;
};

const RecentMatches: React.FC<{ UserID: string }> = ({ UserID }) => {
  const [matches, setmatches] = useState<Match[]>([]);

  useEffect(() => {

    async function get_data() {
      axios.post<Match[]>(
        `${import.meta.env.VITE_SERVER_API_URL}/data`,
        { UserID }, { headers: {
          Authorization: localStorage.getItem('token')
        }}
      ).then(res =>{
        setmatches(res.data);
      })
    }
    get_data();

  },[]);

  return (
    <section className="max-w-8xl mx-auto">

      <div className="grid gap-4">
        {matches.sort((a, b) => b.id - a.id).map((match) => (
          <div
            key={match.id}
            className={`p-6 bg-gray-800/50 backdrop-blur-sm border rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
              match.winner_id === Number(UserID)
                ? "border-green-500/30 hover:border-green-400/50"
                : match.winner_id == 0
                ? "border-blue-500/30 hover:border-blue-400/50"
                : "border-red-500/30 hover:border-red-400/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-xl ${
                    match.winner_id === Number(UserID) 
                    ? "bg-green-500/20 text-green-400" 
                    : match.winner_id == 0
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {match.winner_id === Number(UserID) ? <Trophy size={24} /> : match.winner_id == 0 ?  <Equal size={24} /> : <X size={24} />}
                </div>

                <div>
                  <h3 className="text-lg font-semibold">vs {match.opponent_username.toUpperCase()}</h3>
                  <p className="text-gray-400 text-sm flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{match.completed_at}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold">
                  <span className="text-gray-400">Stake: </span>
                  <span className="text-white">{match.stake_amount}</span>
                </div>
                <div className={`text-sm ${match.winner_id === Number(UserID) ? "text-green-400" : match.winner_id == 0 ?  "text-blue-400" : "text-red-400"}`}>
                  {match.winner_id === Number(UserID) ? `Won: ${match.stake_amount}` : match.winner_id == 0 ? "Match Draw" : "Lost stake"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="px-6 py-3 bg-gray-800/50 border border-purple-500/30 rounded-xl hover:border-purple-400/50 transition-colors">
          View All Matches
        </button>
      </div>
    </section>
  )
}

export default RecentMatches
