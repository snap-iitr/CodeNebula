import type React from "react"
import { motion } from "framer-motion"
    
    const StatCard: React.FC<{
    title: string
    value: string | number
    subtitle?: string
    icon: React.ReactNode
    color: string
    delay: number
    }> = ({ title, value, subtitle, icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ scale: 1.05, y: -5 }}
        className={`group relative p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl transition-all duration-300 hover:border-${color}-500/50 hover:shadow-lg hover:shadow-${color}-500/10`}
    >
        {/* Glow effect on hover */}
        <div
        className={`absolute inset-0 bg-gradient-to-r from-${color}-500/10 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
        ></div>

        <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 bg-gradient-to-r from-${color}-500 to-purple-500 rounded-xl`}>{icon}</div>
        </div>

        <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
        </div>
    </motion.div>
    )

    export default StatCard;