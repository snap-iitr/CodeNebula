"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion"
import { Users, UserPlus, Search } from "lucide-react"
import FriendCard from "../components/FriendCard"
import RequestCard from "../components/RequestCard"
import SearchFriendCard from "../components/SearchFriendCard"
import LoadingSkeleton from '../components/LoadingSkeleton'
import Navbar from '../components/Navbar';


interface Friend {
  id: string
  username: string
  walletAddress: string
  avatar: string
  gamesWon: number
  gamesPlayed: number
}

interface FriendRequest {
  id: string
  username: string
  walletAddress: string
  avatar: string
}

interface SearchResult {
  id: string
  username: string
  walletAddress: string
  avatar: string
}

const FriendsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"friends" | "requests" | "search">("friends")
  const [searchQuery, setSearchQuery] = useState("")
  const [changes, setChanges] = useState<boolean>(false) // Used to trigger re-fetching of data
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  // Load Data
  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {

      await axios.get<{Friends : Friend[]; FriendsRequests : FriendRequest[]}>(
        `${import.meta.env.VITE_SERVER_API_URL}/get-friends`,
        { withCredentials: true }
      ).then(res => {
        // Handle successful response
        setFriends(res.data.Friends);
        setFriendRequests(res.data.FriendsRequests);
      }).catch(err => {
        // Handle error
        console.error("Error loading friends data:", err);
      });
    }
    loadData()
  }, [changes]);

  // Search debounce
  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsSearching(true)
      const timer = setTimeout(async () => {

        await axios.post<SearchResult[]>(
          `${import.meta.env.VITE_SERVER_API_URL}/search-friends`,
          { searchQuery },
          { withCredentials: true }
        ).then(res => {
          // Handle successful response
          setSearchResults(res.data);
          setIsSearching(false);
        }).catch(err => {
          // Handle error
          console.error("Error loading friends data:", err);
          setIsSearching(false);
        });
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery,changes]);

  const tabs = [
    { id: "friends", label: "My Friends", icon: Users, count: friends.length },
    { id: "requests", label: "Requests", icon: UserPlus, count: friendRequests.length },
    { id: "search", label: "Add Friends", icon: Search, count: null },
  ]

  // Toggle changes to trigger data reload
  const toggleChanges = () => setChanges((prev) => !prev);

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
        <Navbar PageName="Friends"/>

        <div className="max-w-7xl mx-auto p-6 py-24">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Desktop */}
            <motion.aside
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block w-80"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border-l-4 border-cyan-400 text-white"
                          : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <tab.icon size={20} />
                        <span className="font-medium">{tab.label}</span>
                      </div>
                      {tab.count !== null && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            activeTab === tab.id ? "bg-cyan-500 text-white" : "bg-gray-600 text-gray-300"
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.aside>

            {/* Mobile Tab Bar */}
            <div className="lg:hidden">
              <div className="flex space-x-2 bg-gray-800/30 rounded-lg p-1 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-purple-600/50 text-white border border-purple-500/50"
                        : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >
                    <tab.icon size={16} />
                    <span className="text-sm font-medium">{tab.label}</span>
                    {tab.count !== null && (
                      <span className="px-1.5 py-0.5 bg-cyan-500 text-white rounded-full text-xs font-semibold">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <motion.main initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
              <AnimatePresence mode="wait">
                {activeTab === "friends" && (
                  <motion.div
                    key="friends"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white">My Friends ({friends.length})</h2>
                    </div>

                    <div className="grid gap-6">
                      {friends.map((friend, index) => (
                        <motion.div
                          key={friend.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <FriendCard friend={friend} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "requests" && (
                  <motion.div
                    key="requests"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold text-white">Friend Requests ({friendRequests.length})</h2>

                    <div className="grid gap-6">
                      {friendRequests.map((request, index) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <RequestCard request={request} onChange={toggleChanges} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "search" && (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold text-white">Search Friends</h2>

                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search by username or wallet address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600/30 rounded-2xl text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
                      />
                    </div>

                    {isSearching ? (
                      <LoadingSkeleton />
                    ) : searchResults.length > 0 ? (
                      <div className="grid gap-6">
                        {searchResults.map((result, index) => (
                          <motion.div
                            key={result.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <SearchFriendCard result={result} onChange={toggleChanges} />
                          </motion.div>
                        ))}
                      </div>
                    ) : searchQuery.length > 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">No results found</h3>
                        <p className="text-gray-500">Try searching with a different username or wallet address</p>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                        <div className="text-6xl mb-4">👥</div>
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">Find new friends</h3>
                        <p className="text-gray-500">Search for players by their username or wallet address</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FriendsPage
