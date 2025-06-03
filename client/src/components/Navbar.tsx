"use client"

import type React from "react"
import { useState } from "react"
import { jwtDecode } from 'jwt-decode';
import { getCookie } from '../utils/Cookies';
import { Link } from "react-router";
import { Menu, X, Settings, LogOut, User } from "lucide-react"

export interface JwtPayload {
  username: string;
  email: string;
  wallet_address: string;
}

const Navbar: React.FC = () => {
  const token = getCookie('jwt');
  if (!token) return null;
  const decoded: JwtPayload = jwtDecode(token);
  const walletAddress = decoded.wallet_address;
  const username = decoded.username;
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)


  return (
    <nav className="relative z-50 bg-black/20 backdrop-blur-md border-b border-purple-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-cyber tracking-wider">
              ETH BATTLE ARENA
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
              Home
            </a>
            <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
              Profile
            </a>
            <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
              Friends
            </a>
            <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
              Leaderboard
            </a>
          </div>

          {/* Wallet Info & Avatar */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-2 hover:border-purple-400/50 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">{username}</div>
                  <div className="text-xs text-gray-400">{walletAddress}</div>
                </div>
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-md border border-purple-500/30 rounded-lg shadow-xl">
                  <a
                    href="#"
                    className="flex items-center space-x-2 px-4 py-3 text-sm hover:bg-purple-500/20 transition-colors"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </a>
                  <Link
                    to="/disconnect"
                    className="flex items-center space-x-2 px-4 py-3 text-sm hover:bg-red-500/20 transition-colors text-red-400"
                  >
                    <LogOut size={16} />
                    <span>Disconnect</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-800/50 border border-purple-500/30"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-500/20">
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                Home
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                Profile
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                Friends
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                Leaderboard
              </a>
              <div className="pt-4 border-t border-purple-500/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{username}</div>
                    <div className="text-xs text-gray-400">{walletAddress}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <a href="#" className="flex items-center space-x-2 text-sm text-gray-300">
                    <Settings size={16} />
                    <span>Settings</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 text-sm text-red-400">
                    <LogOut size={16} />
                    <span>Disconnect</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
