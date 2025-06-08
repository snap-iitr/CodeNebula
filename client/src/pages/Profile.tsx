"use client"

import type React from "react"
import axios from "axios"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams } from 'react-router-dom';
import RecentMatches from "../components/RecentMatches"
import BadgeCard from "../components/BadgeCard";
import StatCard from "../components/StatCard"
import { Edit, Trophy, Target, TrendingUp, Zap, Award, Crown, Shield, Flame, Star } from "lucide-react"

interface Badge {
  name: string
  icon: React.ReactNode
  description: string
  earned: boolean
}

interface Player {
  id: number
  username: string
  email: string
  wallet_address: string
  created_at: string
}

type Match = {
  id: number;
  player1_id: number;
  player2_id: number;
  winner_id: number;
  stake_amount: string; // in ETH string
  completed_at: string; // ISO date
};

const Profile: React.FC = () => {

    const { UserId } = useParams<{ UserId: string }>()
    const [isEditing, setIsEditing] = useState(false)
    const [UserGames, setUserGames] = useState<Match[]>([]);
    const [walletAddress, setWalletAddress] = useState<string>("Loading...");
    const [Username, setUsername] = useState<string>("Loading...");
    const [TotalGames, setTotalGames] = useState<number>(0);
    const [TotalWins, setTotalWins] = useState<number>(0);
    const [WinRate, setWinRate] = useState<string>("0");
    const [EthWon, setEthWon] = useState<number>(0);
    const [LastGameResult, setLastGameResult] = useState<string>("---");
    const [LastGameAmount, setLastGameAmount] = useState<string>("---");

    useEffect(() => {
        async function get_player_data() {
        axios.post<Player>(
            'http://localhost:3000/player-data',
            { UserId }, { withCredentials: true }
        ).then(res =>{
            const data = res.data;
            setUsername(data.username);
            setWalletAddress(data.wallet_address);
        })
        }

        async function get_data() {
        axios.post<Match[]>(
            'http://localhost:3000/player-matches-data',
            { UserId }, { withCredentials: true }
        ).then(res =>{
            const data = res.data;
            setUserGames(data);
        })
        }
        
        get_player_data();
        get_data();
    }, []);

    useEffect(() => {
        if(!UserGames || UserGames.length === 0) return;

        setTotalGames(UserGames.length);

        const wins = UserGames.filter(match => match.winner_id === Number(UserId));
        setTotalWins(wins.length);
        setWinRate(((wins.length / UserGames.length) * 100).toFixed(2));

        const totalEthWon = wins.reduce((sum, match) => sum + parseFloat(match.stake_amount), 0);
        setEthWon(totalEthWon);

        const lastMatch = UserGames.sort(
            (a, b) => b.id - a.id
        )[0];
        if(lastMatch) setLastGameResult(lastMatch.winner_id === Number(UserId) ? "Victory" : lastMatch.winner_id === 0 ? "Tie" : "Defeat");
        if(lastMatch) setLastGameAmount(lastMatch.stake_amount);

    },[UserGames]);

    const UserBadges: Badge[] = [
        {
        name: "First Victory",
        icon: <Trophy className="w-6 h-6" />,
        description: "Win your first match",
        earned: true,
        },
        {
        name: "Streak Master",
        icon: <Flame className="w-6 h-6" />,
        description: "Win 5 matches in a row",
        earned: true,
        },
        {
        name: "ETH Collector",
        icon: <Star className="w-6 h-6" />,
        description: "Earn 10 ETH total",
        earned: false,
        },
        {
        name: "Code Warrior",
        icon: <Shield className="w-6 h-6" />,
        description: "Win 100 matches",
        earned: false,
        },
        {
        name: "Speed Demon",
        icon: <Zap className="w-6 h-6" />,
        description: "Win a match in under 5 minutes",
        earned: true,
        },
        {
        name: "Champion",
        icon: <Crown className="w-6 h-6" />,
        description: "Reach Diamond rank",
        earned: false,
        },
    ]

    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        {/* Animated background */}
        <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.3)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
        </div>

        {/* Floating particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
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
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
            }}
            />
        ))}
        </div>

        <div className="relative z-10 min-h-screen">
        {/* Header */}
        <motion.header
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 border-b border-gray-700/50 backdrop-blur-sm"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">E</span>
                </div>
                <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-cyber tracking-wider">
                    PROFILE
                </h1>
                <p className="text-gray-400 text-sm">Your gaming statistics and achievements</p>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
            >
                <Edit size={16} />
                <span>Edit Profile</span>
            </motion.button>
            </div>
        </motion.header>

        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* User Header */}
            <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-8"
            >
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Avatar */}
                <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-6xl">🎮</div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full blur opacity-30 animate-pulse"></div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl font-bold text-white mb-2 font-cyber tracking-wide">{Username}</h2>
                <p className="text-gray-400 font-mono mb-4">{walletAddress}</p>

                {/* Rank Badge */}
                <div
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full">
                    <span className="text-2xl">🥇</span>
                    <span className="font-bold text-white">Gold Rank</span>
                </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <div className="text-2xl font-bold text-cyan-400">{TotalGames}</div>
                    <div className="text-sm text-gray-400">Total Games</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-green-400">{TotalWins} ETH</div>
                    <div className="text-sm text-gray-400">Total Wins</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-purple-400">{WinRate}%</div>
                    <div className="text-sm text-gray-400">Win Rate</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-yellow-400">{LastGameResult}</div>
                    <div className="text-sm text-gray-400">Last Game</div>
                </div>
                </div>
            </div>
            </motion.section>

            {/* Stats Grid */}
            <section>
            <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-cyber tracking-wider"
            >
                DETAILED STATISTICS
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                title="Total Games"
                value={TotalGames}
                icon={<Target className="w-6 h-6 text-white" />}
                color="blue"
                delay={0.1}
                />
                <StatCard
                title="Total Wins"
                value={TotalWins}
                subtitle={`${TotalGames - TotalWins} losses`}
                icon={<Trophy className="w-6 h-6 text-white" />}
                color="green"
                delay={0.2}
                />
                <StatCard
                title="ETH Earned"
                value={`$${EthWon} ETH`}
                subtitle="All-time earnings"
                icon={<TrendingUp className="w-6 h-6 text-white" />}
                color="cyan"
                delay={0.3}
                />
                <StatCard
                title="Win Ratio"
                value={`${WinRate}%`}
                subtitle="Success rate"
                icon={<Award className="w-6 h-6 text-white" />}
                color="purple"
                delay={0.4}
                />
                <StatCard
                title="Last Game Result"
                value={LastGameResult}
                subtitle={`Amount: ${LastGameAmount} ETH`}
                icon={<Flame className="w-6 h-6 text-white" />}
                color="yellow"
                delay={0.5}
                />
                <StatCard
                title="Highest Difficulty"
                value="Hard"
                subtitle="Best achievement"
                icon={<Zap className="w-6 h-6 text-white" />}
                color="red"
                delay={0.6}
                />
            </div>
            </section>

            {/* Badges & Achievements */}
            <section>
            <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-cyber tracking-wider"
            >
                BADGES & ACHIEVEMENTS
            </motion.h3>

            <div className="flex space-x-4 overflow-x-auto pb-4">
                {UserBadges.map((badge, index) => (
                <BadgeCard key={badge.name} badge={badge} index={index} />
                ))}
            </div>
            </section>

            {/* Match History */}
            <section>
            <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-cyber tracking-wider"
            >
                RECENT MATCH HISTORY
            </motion.h3>

            <div className="space-y-4">
                <RecentMatches UserID={UserId ?? ""} />
            </div>
            </section>
        </div>
        </div>
    </div>
    )
}

export default Profile;
