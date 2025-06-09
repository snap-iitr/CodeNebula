"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Github, Twitter, DiscIcon as Discord, Mail, ExternalLink, Heart } from "lucide-react"

const Footer: React.FC = () => {
  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      href: "#",
      color: "hover:text-gray-300",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "#",
      color: "hover:text-blue-400",
    },
    {
      name: "Discord",
      icon: Discord,
      href: "#",
      color: "hover:text-purple-400",
    },
    {
      name: "Email",
      icon: Mail,
      href: "#",
      color: "hover:text-green-400",
    },
  ]

  const footerLinks = [
    {
      title: "Game",
      links: [
        { name: "How to Play", href: "#" },
        { name: "Leaderboard", href: "#" },
        { name: "Tournament", href: "#" },
        { name: "Rules", href: "#" },
      ],
    },
    {
      title: "Community",
      links: [
        { name: "Discord", href: "#" },
        { name: "Twitter", href: "#" },
        { name: "Reddit", href: "#" },
        { name: "Blog", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Contact Us", href: "#" },
        { name: "Bug Reports", href: "#" },
        { name: "Feature Requests", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "Disclaimer", href: "#" },
      ],
    },
  ]

  return (
    <footer className="w-full bg-gradient-to-t from-black via-gray-900/95 to-gray-900/50 backdrop-blur-sm border-t border-gray-700/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/6 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/6 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl"></div>
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.3)_1px,transparent_1px)] bg-[size:80px_80px] animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Main footer content */}
        <div className="w-full px-4 md:px-8 lg:px-12 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
              {/* Brand section */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-xl">E</span>
                    </div>
                    <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-cyber tracking-wider">
                      ETH BATTLE ARENA
                    </span>
                  </div>
                  <p className="text-gray-400 leading-relaxed max-w-md text-lg">
                    The ultimate Web3 gaming platform where developers compete in head-to-head coding battles. Stake
                    ETH, prove your skills, and earn rewards in the blockchain arena.
                  </p>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.15, y: -3 }}
                        className={`p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 transition-all duration-200 ${social.color} hover:border-gray-600/50 hover:bg-gray-700/50`}
                      >
                        <social.icon size={20} />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Links sections */}
              {footerLinks.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + sectionIndex * 0.1 }}
                  className="space-y-6"
                >
                  <h3 className="text-white font-bold text-lg uppercase tracking-wider">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <motion.li
                        key={link.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + sectionIndex * 0.1 + linkIndex * 0.05 }}
                      >
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group text-base"
                        >
                          <span>{link.name}</span>
                          <ExternalLink
                            size={14}
                            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          />
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Newsletter section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16 pt-12 border-t border-gray-800/50"
            >
              <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="text-center lg:text-left">
                  <h3 className="text-white font-bold text-xl mb-3">Stay Updated</h3>
                  <p className="text-gray-400 text-lg">Get the latest updates on tournaments, features, and rewards.</p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-6 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-purple-500/50 focus:outline-none transition-colors min-w-[300px]"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 whitespace-nowrap"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Bottom section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-16 pt-12 border-t border-gray-800/50"
            >
              <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 text-gray-400">
                  <span className="text-lg">© 2024 ETH Battle Arena. All rights reserved.</span>
                  <div className="flex items-center space-x-6">
                    <a href="#" className="hover:text-white transition-colors text-base">
                      Privacy
                    </a>
                    <a href="#" className="hover:text-white transition-colors text-base">
                      Terms
                    </a>
                    <a href="#" className="hover:text-white transition-colors text-base">
                      Cookies
                    </a>
                  </div>
                </div>

                {/* Made with love by Sourav */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 text-lg text-gray-400 group cursor-pointer"
                >
                  <span>Made with</span>
                  <Heart
                    size={18}
                    className="text-red-500 group-hover:text-red-400 transition-colors animate-pulse"
                    fill="currentColor"
                  />
                  <span>by</span>
                  <span className="text-white font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Sourav
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Top border gradient */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      </div>
    </footer>
  )
}

export default Footer
