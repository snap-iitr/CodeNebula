import type React from "react"
import type { LucideIcon } from "lucide-react"

interface DashboardCardProps {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
  color: string
  bgColor: string
  borderColor: string
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  bgColor,
  borderColor,
}) => {
  return (
    <div
      className={`group relative p-6 bg-gradient-to-br ${bgColor} backdrop-blur-sm border ${borderColor} rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10`}
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${color} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
      ></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 bg-gradient-to-r ${color} rounded-xl`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>

        <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
    </div>
  )
}

export default DashboardCard
