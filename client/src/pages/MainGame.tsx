"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSocket } from "../utils/SocketContext"
import { motion } from "framer-motion"
import { Play, Send, Trophy, Bot, X } from "lucide-react"
import CodeEditor from "../components/CodeEditor" //other options like monaco-editor can be used here
import PlayerCard from "../components/PlayerCard"

type LocationState = {
  opponent: string
  username: string
  walletAddress: string
  roomID: string
  html: string
  opponentWalletAddress: string
  problemID: string
  email: string
  id: string
}

declare global {
  interface Window {
    renderMath?: () => void
  }
}

interface Player {
  username: string
  avatar: string
  walletAddress: string
}

interface ChatMessage {
  sender: "user" | "bot"
  text: string
  timestamp: Date
}

const MainGame: React.FC = () => {
  const { socket } = useSocket()
  const navigate = useNavigate()
  const location = useLocation()
  const [state, setstate] = useState<LocationState>()
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes
  const [selectedLanguage, setSelectedLanguage] = useState("C++")
  const [code, setCode] = useState("")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [started, setStarted] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: "bot", text: "Hello! I'm your coding assistant. How can I help you today?", timestamp: new Date() },
  ])
  const [isBotTyping, setIsBotTyping] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)

  const currentUser: Player = {
    username: state ? state.username : "CryptoGamer",
    avatar: "🎮",
    walletAddress: state ? state.walletAddress : "0xAb...89Ef",
  }

  const opponent: Player = {
    username: state ? state.opponent : "CodeNinja",
    avatar: "🥷",
    walletAddress: state ? state.opponentWalletAddress : "0x...opponentAddress",
  }

  useEffect(() => {
    if (location.state) setstate(location.state)
    else navigate("/home")
  }, [location.state, navigate])

  useEffect(() => {
    const handleKeydown = async () => {
      await document.documentElement.requestFullscreen()
      setStarted(true)
      window.removeEventListener("keydown", handleKeydown)
    }
    window.addEventListener("keydown", handleKeydown)
    return () => {
      window.removeEventListener("keydown", handleKeydown)
    }
  }, [])

  useEffect(() => {
    const onFullScreenChange = () => {
      const isFullscreen = document.fullscreenElement !== null
      if (!isFullscreen) {
        alert("You exited fullscreen! Please stay in fullscreen mode.")
      }
    }

    document.addEventListener("fullscreenchange", onFullScreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", onFullScreenChange)
    }
  }, [])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert("You switched tabs or minimized the window.")
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // Socket events
  useEffect(() => {
    if (!state) return
    if (!socket || !state.roomID) return

    // Join the room explicitly
    if (socket.connected) {
      socket.emit("joined_room", { roomID: state.roomID, email: state.email })
    } else navigate("/home")

    socket.on("submitted", () => {
      socket.disconnect()
      alert("🚀 Solution submitted successfully!! You will be navigated to home now")
      setOutput("🚀 Solution submitted successfully!! You will be navigated to home now")
      setTimeout(() => {
        navigate("/home")
      }, 3000)
    })
    
    socket.on("game_tied", () => {
      socket.disconnect()
      alert("⏱ Time's up! Game tied.")
      setOutput("⏱ Time's up! Game tied.")
      setTimeout(() => {
        navigate("/home")
      }, 3000)
    })

    socket.on("hint_response", (data: string) => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data,
          timestamp: new Date(),
        },
      ])
      setIsBotTyping(false)
    })

    socket.on("code_output", (data: string) => {
      setOutput(data)
      setIsRunning(false)
    })

    return () => {
      socket.off("submitted")
      socket.off("hint_response")
      socket.off("code_output")
      socket.off("game_tied")
    }
  }, [socket, state, navigate])
  // Socket events end

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, isSubmitted])

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

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
    if (!socket) return
    setIsRunning(true)
    // Simulate API call
    const selectedLang = languages.find((lang) => lang.value === selectedLanguage)
    const languageCode = selectedLang?.code
    socket.emit("run_code", { languageCode, code, input })
  }

  const handleSubmit = () => {
    if (!socket) return
    setIsSubmitted(true)
    setOutput("🚀 Solution submitted successfully!! You will be navigated to home now")
    const selectedLang = languages.find((lang) => lang.value === selectedLanguage)
    const languageExtension = selectedLang?.extension
    const problemID = state?.problemID
    const roomID = state?.roomID
    const Id = state?.id
    const WalletAddress = currentUser.walletAddress
    const OpponentWalletAddress = opponent.walletAddress
    socket.emit("submit_code", {
      roomID,
      selectedLanguage,
      problemID,
      code,
      languageExtension,
      WalletAddress,
      OpponentWalletAddress,
      Id,
    })
  }

  const handleSendChatMessage = () => {
    if (!socket) return
    if (!chatMessage.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      sender: "user",
      text: chatMessage,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatMessage("")
    setIsBotTyping(true)

    const html = state?.html;
    socket.emit("get_hint", {
      html,
      chatMessage
    })
  }

  const languages = [
    { value: "Python3", label: "Python", icon: "🐍", code: 5, extension: ".py" },
    { value: "C++", label: "C++", icon: "➕➕", code: 7, extension: ".cpp" },
    { value: "C", label: "C", icon: "🅲", code: 6, extension: ".c" },
    { value: "Java", label: "Java", icon: "☕️", code: 4, extension: ".java" },
    { value: "Ruby", label: "Ruby", icon: "💎", code: 12, extension: ".rb" },
    { value: "Rust", label: "Rust", icon: "🦀", code: 46, extension: ".rs" },
    { value: "javascript", label: "JavaScript", icon: "⚡", code: 17, extension: ".js" },
    { value: "php", label: "PHP", icon: "🐘", code: 8, extension: ".php" },
    { value: "swift", label: "Swift", icon: "🦅", code: 37, extension: ".swift" },
    { value: "go", label: "Go", icon: "🐹", code: 20, extension: ".go" },
    { value: "typescript", label: "TypeScript", icon: "🔷", code: 60, extension: ".ts" },
    { value: "kotlin", label: "Kotlin", icon: "🅺", code: 43, extension: ".kt" },
  ]

  const styledHtml = `
  <html>
    <head>
      <style>
        body {
          color: white;
          // background-color: #1a1a1a;
          margin: 0;
          padding: 1rem;
          font-family: mono;
        }
      </style>
    </head>
    <body>
      <pre className="whitespace-pre-wrap">---Problem Desciption Started---</pre>
      ${state?.html || ''}
      <pre className="whitespace-pre-wrap">---Problem Desciption Ended---</pre>
    </body>
  </html>
  `;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden ${!started ? "blur-md pointer-events-none" : ""}`}
    >
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
              <div className="w-[40%] flex flex-col p-4 h-full">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 flex-1 h-full">
                  <h2 className="text-2xl font-bold mb-4 text-blue-400 font-cyber tracking-wide">Problem Statement:</h2>
                  <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-auto max-h-[calc(85vh)]">
                    <iframe
                      title="Game Frame"
                      srcDoc={styledHtml}
                      style={{ width: "100%", height: "100vh", border: "none" }}
                      sandbox="allow-scripts allow-same-origin"
                    />
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
                      {isRunning ? (
                        <div className="text-gray-500 text-xs">Running...</div>
                      ) : (
                        <>
                          {output ? (
                            <pre className="text-xs text-gray-300 whitespace-pre-wrap">{output}</pre>
                          ) : (
                            <div className="text-gray-500 text-xs">Output will appear here...</div>
                          )}
                        </>
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

      {/* Chat Bot Button (Fixed Position) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsChatOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg z-50 ${isChatOpen ? "hidden" : "flex"}`}
      >
        <Bot size={24} className="text-white" />
      </motion.button>

      {/* Chat Bot Panel */}
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: isChatOpen ? 0 : "100%", opacity: isChatOpen ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 w-96 h-full bg-gray-900/95 backdrop-blur-md border-l border-purple-500/30 shadow-xl z-50 flex flex-col"
      >
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gradient-to-r from-purple-900/80 to-cyan-900/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Coding Assistant</h3>
              <p className="text-xs text-gray-300">Ask for hints and guidance</p>
            </div>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.sender === "user"
                    ? "bg-purple-600 text-white rounded-tr-none"
                    : "bg-gray-800 text-gray-200 rounded-tl-none"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {isBotTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-800 text-gray-200 rounded-tl-none">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="flex space-x-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
              placeholder="Ask for coding help..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendChatMessage}
              className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center"
            >
              <Send size={18} className="text-white" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default MainGame
