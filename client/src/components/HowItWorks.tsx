"use client"

import type React from "react"
import axios from 'axios';
import { BrowserProvider, parseEther } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"
import { Code, Zap, Award, Lightbulb, ArrowRight } from "lucide-react"

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = async () => {
    try{
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }
      // Create a new ethers provider and signer
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: import.meta.env.VITE_ADMIN_WALLET_ADDRESS,
        value: parseEther("0.001"),
      });

      console.log("Transaction sent:", tx.hash);

      await tx.wait(); // Wait for confirmation

      await axios.post<string>(
        `${import.meta.env.VITE_SERVER_API_URL}/set-loading`,
        { txHash: tx.hash },
        { headers: {
          Authorization: localStorage.getItem('token')
        }}
      ).then(res =>{
        console.log("Gaming session started:", res.data);
        navigate('/loading');
      })
      .catch(() => {
        navigate('/home');
      });

    } catch (error: any) {
      console.error("Payment error:", error);
      alert(`Payment failed: ${error.message || error}`);
    }
  };

  return (
    <section className="w-full bg-gradient-to-br from-gray-900/50 via-purple-900/30 to-gray-900/50 backdrop-blur-sm border-y border-gray-700/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl"></div>
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.3)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse"></div>
      </div>

      <div className="relative z-10 py-20 px-4 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-20 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-cyber tracking-wider"
          >
            HOW THE GAME WORKS
          </motion.h2>

          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            {/* Left side - Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-full lg:w-1/2 flex flex-col gap-16 lg:gap-20"
            >
              <div className="relative group">
                {/* Outer glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-700"></div>

                {/* Inner glow border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/40 to-purple-500/40 rounded-3xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>

                <div className="relative overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
                  <img
                    src="/Game_Loading.png"
                    alt="ETH Battle Arena Gameplay"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                  {/* Live indicator */}
                  <div className="absolute top-6 left-6">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full border border-cyan-500/30">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      <span className="text-cyan-400 text-sm font-semibold">GAME LOADING</span>
                    </div>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center justify-between">
                      <div className="px-3 py-1 bg-cyan-500/80 text-white text-xs font-semibold rounded-full">
                        1v1 CODING BATTLE
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative group">
                {/* Outer glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-700"></div>

                {/* Inner glow border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/40 to-purple-500/40 rounded-3xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>

                <div className="relative overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
                  <img
                    src="/Live_Gameplay.png"
                    alt="ETH Battle Arena Gameplay"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                  {/* Live indicator */}
                  <div className="absolute top-6 left-6">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full border border-cyan-500/30">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      <span className="text-cyan-400 text-sm font-semibold">LIVE GAMEPLAY</span>
                    </div>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center justify-between">
                      <div className="px-3 py-1 bg-purple-500/80 text-white text-xs font-semibold rounded-full">
                        REAL-TIME
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right side - Text content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-full lg:w-1/2 space-y-10"
            >
              <div>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-cyber tracking-wide mb-4">
                  Compete in 1v1 Battles
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Enter the ultimate blockchain gaming arena where code meets cryptocurrency in epic head-to-head
                  battles.
                </p>
              </div>

              <div className="space-y-8 text-gray-300">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start space-x-6 group"
                >
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mt-1 group-hover:scale-110 transition-transform duration-300">
                    <Code size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-white mb-2">Stake ETH & Battle</h4>
                    <p className="text-gray-300 leading-relaxed">
                      Two players enter a head-to-head coding challenge, each staking ETH to join the battle. The stakes
                      are high, and the code must be perfect.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-start space-x-6 group"
                >
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mt-1 group-hover:scale-110 transition-transform duration-300">
                    <Zap size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-white mb-2">Solve & Win</h4>
                    <p className="text-gray-300 leading-relaxed">
                      The first player to correctly solve the coding challenge wins 90% of the combined ETH pot.
                      Solutions are verified instantly on the blockchain.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start space-x-6 group"
                >
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mt-1 group-hover:scale-110 transition-transform duration-300">
                    <Lightbulb size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-white mb-2">Get AI Assistance</h4>
                    <p className="text-gray-300 leading-relaxed">
                      Stuck on a problem? Use AI hints to help you solve the challenge, but be quick—your opponent might
                      be close to a solution!
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-start space-x-6 group"
                >
                  <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl mt-1 group-hover:scale-110 transition-transform duration-300">
                    <Award size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-white mb-2">Earn Rewards</h4>
                    <p className="text-gray-300 leading-relaxed">
                      Beyond ETH rewards, earn badges, climb the leaderboard, and gain reputation as one of the top
                      coders in the ETH Battle Arena.
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="pt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStart}
                  className="group relative px-10 py-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 flex items-center space-x-3"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <span className="relative z-10">Start Your First Battle</span>
                  <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom border gradient */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
    </section>
  )
}

export default HowItWorks
