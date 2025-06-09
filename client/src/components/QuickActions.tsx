import type React from "react"
import { Link } from "react-router";
import { jwtDecode } from 'jwt-decode';
import { getCookie } from '../utils/Cookies';
import { Zap, Users, User, Trophy } from "lucide-react"

interface JwtPayload {
  id: string;
  username: string;
  email: string;
  wallet_address: string;
}

const QuickActions: React.FC = () => {
  const token = getCookie('jwt');
  if (!token) return null;
  const decoded: JwtPayload = jwtDecode(token);
  const Id = decoded.id;

  const actions = [
    {
      label: "Start Game",
      link: "/home",
      icon: Zap,
      color: "from-blue-500 to-purple-500",
      hoverColor: "hover:from-blue-400 hover:to-purple-400",
    },
    {
      label: "Friends",
      link: "/friends",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      hoverColor: "hover:from-purple-400 hover:to-pink-400",
    },
    {
      label: "Profile",
      link: `/profile/${Id}`,
      icon: User,
      color: "from-green-500 to-emerald-500",
      hoverColor: "hover:from-green-400 hover:to-emerald-400",
    },
    {
      label: "Leaderboard",
      link: "/leaderboard",
      icon: Trophy,
      color: "from-yellow-500 to-orange-500",
      hoverColor: "hover:from-yellow-400 hover:to-orange-400",
    },
  ]

  return (
    <section className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-cyber tracking-wider">
        QUICK ACTIONS
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link to={action.link}
            key={index}
            className={`group relative p-6 bg-gradient-to-br ${action.color} rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${action.hoverColor}`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors duration-300">
                <action.icon size={24} className="text-white" />
              </div>
              <span className="text-white font-semibold">{action.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default QuickActions
