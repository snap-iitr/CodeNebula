"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
// import { socket } from './socket';
import { useSocket } from '../utils/SocketContext';
import { getCookie } from '../utils/Cookies';
import { X, Zap, Shield, Clock } from "lucide-react"

export interface JwtPayload {
  username: string;
  email: string;
  wallet_address: string;
}

const Loading: React.FC = () => {
  const token = getCookie('jwt');
  if (!token) return null;
  const decoded: JwtPayload = jwtDecode(token);
  const Email = decoded.email;
  const WalletAddress = decoded.wallet_address;
  const Username = decoded.username;
  const navigate = useNavigate();
  const [currentOpponentIndex, setCurrentOpponentIndex] = useState(0)
  const [searchTime, setSearchTime] = useState(0)
  const UserAvatar: string = "🎮"
  const { socket } = useSocket();

  // Join Game via socket.io
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log("Connected to the server");
      socket.emit('join_game', { walletAddress: WalletAddress, username: Username, email: Email });
    };

    const handleGameStart = (data: { opponent: string; roomID: string; html: string; opponentWalletAddress : string; problemID : string }) => {
      navigate('/game', {
        state: {
          opponent: data.opponent,
          username: Username,
          walletAddress: WalletAddress,
          roomID: data.roomID,
          html: data.html,
          opponentWalletAddress: data.opponentWalletAddress, // Assuming opponent is the wallet address
          problemID: data.problemID,
          email: Email,
        },
      });
    };

    socket.on('connect', handleConnect);
    socket.on('game_start', handleGameStart);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('game_start', handleGameStart);
    };
  }, [socket]);
































  // Mock opponent avatars that cycle through
  const opponentAvatars = ["👑", "⚡", "🔥", "💎", "🚀", "⭐", "🎯", "🏆"]

  // Cycle through opponent avatars every 2 seconds
  useEffect(() => {
    const avatarInterval = setInterval(() => {
      setCurrentOpponentIndex((prev) => (prev + 1) % opponentAvatars.length)
    }, 2000)

    return () => clearInterval(avatarInterval)
  }, [opponentAvatars.length])

  // Track search time
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setSearchTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timeInterval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const onCancel = () => {
    console.log("Matchmaking cancelled")
    navigate("/home");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden relative">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.3)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-ping"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-3/4 right-1/3 w-1 h-1 bg-pink-400 rounded-full opacity-40 animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-teal-400 rounded-full opacity-50 animate-ping"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-cyber tracking-wider">
            MATCHMAKING
          </h1>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Clock size={16} className="text-gray-400" />
            <span className="text-gray-400 text-lg">{formatTime(searchTime)}</span>
          </div>
        </header>

        {/* Main Layout */}
        <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 px-6 py-8">
          {/* Left Side - Current User */}
          <div className="w-full max-w-sm">
            <div className="relative p-8 bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl hover:border-cyan-400/50 transition-all duration-300">
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl blur opacity-50"></div>

              <div className="relative z-10 text-center">
                {/* My profile */}
                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent mb-6 font-cyber tracking-wide">
                  MY PROFILE
                </h3>
                {/* User Avatar */}
                <div className="relative mx-auto mb-6 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-4xl animate-pulse">
                    {UserAvatar}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full blur opacity-20 animate-pulse"></div>
                  {/* Status indicator */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-white font-cyber tracking-wide">{Username}</h2>
                  <p className="text-gray-400 text-xs font-mono">{WalletAddress}</p>

                  {/* Game Info */}
                  <div className="space-y-2 pt-4 border-t border-gray-600/30">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Stake:</span>
                      <span className="text-green-400 font-semibold">{"0.001 ETH"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Difficulty:</span>
                      <span className="text-purple-400 font-semibold">{"Random"}</span>
                    </div>
                  </div>
                </div>

                {/* Ready indicator */}
                <div className="mt-6 flex items-center justify-center space-x-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">READY</span>
                </div>
              </div>
            </div>
          </div>

          {/* VS Divider */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 font-cyber tracking-wider">
                VS
              </div>
              <div className="absolute inset-0 text-4xl md:text-6xl font-black text-pink-400/20 blur-sm font-cyber tracking-wider">
                VS
              </div>
            </div>
          </div>

          {/* Right Side - Opponent Search */}
          <div className="w-full max-w-sm">
            <div className="relative p-8 bg-gray-800/50 backdrop-blur-sm border border-pink-500/30 rounded-2xl hover:border-pink-400/50 transition-all duration-300">

              <div className="relative z-10 text-center flex flex-col items-center">
                {/* Search Title */}
                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent mb-6 font-cyber tracking-wide">
                  FINDING OPPONENT...
                </h3>

                {/* Opponent Avatar with Spinner */}
                <div className="relative mx-auto mb-6 w-28 h-28">
                    {/* Rotating spinner */}
                    <div className="absolute inset-0 w-full h-full border-4 border-transparent border-t-cyan-400 border-r-pink-400 rounded-full animate-spin z-0"></div>

                    {/* Avatar */}
                    <div className="absolute inset-2 w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-4xl z-10">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-pink-400/20 rounded-full animate-pulse"></div>
                        <span className="relative z-10">{opponentAvatars[currentOpponentIndex]}</span>
                    </div>
                </div>


                {/* Opponent Status */}
                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-gray-400 font-cyber tracking-wide">OPPONENT: UNKNOWN</h4>
                  <p className="text-gray-500 text-sm">Scanning blockchain...</p>

                  {/* Search Progress */}
                  <div className="space-y-2 pt-4">
                    <div className="flex items-center justify-center space-x-2">
                      <div
                        className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"
                        style={{ animationDelay: "0s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-pink-400 rounded-full animate-ping"
                        style={{ animationDelay: "0.5s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-teal-400 rounded-full animate-ping"
                        style={{ animationDelay: "1s" }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">Matching skill level & stake amount</p>
                  </div>
                </div>

                {/* Search indicators */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Players online:</span>
                    <span className="text-green-400">2,847</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Avg. wait time:</span>
                    <span className="text-yellow-400">~30s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Actions */}
        <footer className="p-6 flex justify-center">
          <button
            onClick={onCancel}
            className="group flex items-center space-x-2 px-6 py-3 bg-red-600/20 border border-red-500/30 rounded-xl hover:border-red-400/50 hover:bg-red-600/30 transition-all duration-300 text-red-400 hover:text-red-300"
          >
            <X size={18} />
            <span className="font-semibold">Cancel Matchmaking</span>
          </button>
        </footer>

        {/* Additional UI Elements */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <div className="p-2 bg-gray-800/50 border border-gray-600/30 rounded-lg">
            <Zap size={16} className="text-yellow-400" />
          </div>
          <div className="p-2 bg-gray-800/50 border border-gray-600/30 rounded-lg">
            <Shield size={16} className="text-green-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading
