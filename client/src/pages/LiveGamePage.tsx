"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Send, Trophy } from "lucide-react"
import CodeEditor from "../components/CodeEditor" //other options like monaco-editor can be used here
import PlayerCard from "../components/PlayerCard"

interface Player {
  username: string
  avatar: string
  walletAddress: string
}

const LiveGamePage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [code, setCode] = useState("")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const currentUser: Player = {
    username: "CryptoGamer",
    avatar: "🎮",
    walletAddress: "0xAb...89Ef",
  }

  const opponent: Player = {
    username: "CodeNinja",
    avatar: "🥷",
    walletAddress: "0xDe...F8G2",
  }

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, isSubmitted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTimerColor = () => {
    if (timeLeft > 300) return "text-green-400" // > 5 min
    if (timeLeft > 120) return "text-yellow-400" // > 2 min
    return "text-red-400" // < 2 min
  }

  const handleRunCode = async () => {
    setIsRunning(true)
    // Simulate API call
    setTimeout(() => {
      setOutput(`All test cases passed!`)
      setIsRunning(false)
    }, 2000)
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    setOutput("🚀 Solution submitted successfully! Waiting for opponent...")
  }

  const languages = [
  { value: "javascript", label: "JavaScript", icon: "⚡" },   // Yellow square for JS
  { value: "python", label: "Python", icon: "🐍" },          // Python snake
  { value: "cpp", label: "C++", icon: "➕➕" },              // Plus signs for C++
  { value: "c", label: "C", icon: "🅲" },                     // Letter C in circle
  { value: "java", label: "Java", icon: "☕️" },               // Coffee cup
  { value: "ruby", label: "Ruby", icon: "💎" },               // Gemstone
  { value: "php", label: "PHP", icon: "🐘" },                 // Elephant
  { value: "swift", label: "Swift", icon: "🦅" },             // Eagle (Swift bird)
  { value: "go", label: "Go", icon: "🐹" },                   // Gopher
  { value: "typescript", label: "TypeScript", icon: "🔷" },   // Blue diamond
  { value: "kotlin", label: "Kotlin", icon: "🅺" },            // Letter K in circle
  { value: "rust", label: "Rust", icon: "🦀" },               // Crab
  { value: "sql", label: "SQL", icon: "🗄️" },                 // File cabinet
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.3)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
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

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Bar - Logo, Player Info & Timer */}
        <header className="p-3 border-b border-gray-700/50 backdrop-blur-sm">
          <div className="w-full flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-cyber tracking-wider">
                ETH BATTLE ARENA
              </span>
            </div>

            {/* Players */}
            <div className="flex items-center gap-3 flex-1 max-w-md justify-center">
              <PlayerCard player={currentUser} />
              <div className="hidden md:block text-xl font-bold text-purple-400">VS</div>
              <PlayerCard player={opponent} isOpponent />
            </div>

            {/* Timer & Prize - More prominent */}
            <div className="flex items-center space-x-8 bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-xl px-6 py-3">
              <div className="text-center">
                <div className={`text-3xl md:text-4xl font-bold font-mono ${getTimerColor()}`}>
                  {formatTime(timeLeft)}
                </div>
                <div className="text-xs text-gray-400 font-semibold">TIME LEFT</div>
              </div>
              <div className="w-px h-12 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center">
                  <Trophy size={24} className="mr-2" />
                  0.002 ETH
                </div>
                <div className="text-xs text-gray-400 font-semibold">PRIZE POOL</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-0">
          <div className="w-full h-full">
            {/* Desktop Layout */}
            <div className="hidden md:flex md:flex-row h-full">
              {/* Left Column - Problem (40%) */}
              <div className="w-[40%] flex flex-col p-4">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 flex-1">
                  <h2 className="text-2xl font-bold mb-4 text-blue-400 font-cyber tracking-wide">Problem Statement:</h2>
                  <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-auto max-h-96">
                    Problem Desciption
                    {/* <pre className="whitespace-pre-wrap">Problem Desciption</pre> */}
                  </div>
                </div>
              </div>

              {/* Right Column - Editor & Controls (60%) */}
              <div className="w-[60%] flex flex-col p-4 space-y-3 h-full">
                {/* Language Selector */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-3">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.icon} {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Code Editor */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-green-500/30 rounded-2xl p-3 flex-1 min-h-0">
                  <div className="h-full">
                    <CodeEditor value={code} onChange={setCode} language={selectedLanguage} />
                  </div>
                </div>

                {/* Input and Output Panels */}
                <div className="grid grid-cols-2 gap-3 h-32">
                  {/* Input Panel */}
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-3">
                    <label className="block text-xs font-medium text-gray-300 mb-2">Custom Input</label>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter test input..."
                      className="w-full h-20 bg-black border border-gray-600 rounded-lg px-2 py-2 text-white font-mono text-xs resize-none focus:border-yellow-400 focus:outline-none"
                    />
                  </div>

                  {/* Output Panel */}
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-3">
                    <label className="block text-xs font-medium text-gray-300 mb-2">Output</label>
                    <div className="w-full h-20 bg-black border border-gray-600 rounded-lg px-2 py-2 text-white font-mono text-xs overflow-auto">
                      {output ? (
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap">{output}</pre>
                      ) : (
                        <div className="text-gray-500 text-xs">Output will appear here...</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRunCode}
                    disabled={isRunning || isSubmitted}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                  >
                    {isRunning ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Play size={18} />
                    )}
                    <span className="text-sm">{isRunning ? "Running..." : "Run Code"}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={isSubmitted}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-green-500/25 transition-all duration-200"
                  >
                    <Send size={18} />
                    <span className="text-sm">{isSubmitted ? "Submitted" : "Submit"}</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default LiveGamePage
