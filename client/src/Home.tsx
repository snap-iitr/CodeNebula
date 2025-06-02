import { useState, type ReactNode } from "react"
import {
  Wallet,
  Coins,
  GamepadIcon,
  TrendingUp,
  TrendingDown,
  Play,
  User,
  Users,
  Trophy,
  Copy,
  CheckCircle,
} from "lucide-react"

interface UserStats {
  walletAddress: string
  ethBalance: number
  totalGamesPlayed: number
  totalEthWon: number
  totalEthLost: number
  userName?: string
}

// Custom Card Components
interface CardProps {
  className?: string
  children: ReactNode
}

const Card = ({ className, children }: CardProps) => (
  <div className={`bg-white dark:bg-slate-800 rounded-lg ${className}`}>{children}</div>
)

interface CardHeaderProps {
  className?: string
  children: ReactNode
}

const CardHeader = ({ className, children }: CardHeaderProps) => <div className={`p-4 ${className}`}>{children}</div>

interface CardTitleProps {
  className?: string
  children: ReactNode
}

const CardTitle = ({ className, children }: CardTitleProps) => (
  <h3 className={`font-medium ${className}`}>{children}</h3>
)

interface CardContentProps {
  className?: string
  children: ReactNode
}

const CardContent = ({ className, children }: CardContentProps) => (
  <div className={`px-4 pb-4 ${className}`}>{children}</div>
)

// Custom Button Component
interface ButtonProps {
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
  children: ReactNode
  onClick?: () => void
}

const Button = ({ variant = "default", size = "default", className = "", children, onClick }: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"

  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-slate-200 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800",
  }

  const sizeStyles = {
    default: "h-10 py-2 px-4 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
  }

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}

// Custom Badge Component
interface BadgeProps {
  variant?: "default" | "secondary" | "outline"
  className?: string
  children: ReactNode
}

const Badge = ({ variant = "default", className = "", children }: BadgeProps) => {
  const variantStyles = {
    default: "bg-blue-600 text-white",
    secondary: "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-slate-100",
    outline: "border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

export default function Dashboard() {
  const [copiedAddress, setCopiedAddress] = useState(false)

  // Mock user data - in a real app, this would come from props or API
  const userStats: UserStats = {
    walletAddress: "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4",
    ethBalance: 2.45,
    totalGamesPlayed: 127,
    totalEthWon: 8.32,
    totalEthLost: 5.87,
    userName: "CryptoGamer",
  }

  const netProfit = userStats.totalEthWon - userStats.totalEthLost
  const isProfit = netProfit >= 0

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome back{userStats.userName ? `, ${userStats.userName}` : ""}! 🎮
              </h1>
              <p className="text-blue-100 mt-1">Ready to play and earn some ETH?</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm">
              <Wallet className="h-4 w-4" />
              <span className="font-mono text-sm">{formatAddress(userStats.walletAddress)}</span>
              <button
                className="h-6 w-6 p-0 text-white hover:bg-white/20 rounded-md flex items-center justify-center"
                onClick={() => copyToClipboard(userStats.walletAddress)}
              >
                {copiedAddress ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* ETH Balance */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">ETH Balance</CardTitle>
              <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <Coins className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.ethBalance.toFixed(3)} ETH</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                ≈ ${(userStats.ethBalance * 2000).toLocaleString()} USD
              </p>
            </CardContent>
          </Card>

          {/* Total Games */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Games Played</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <GamepadIcon className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalGamesPlayed.toLocaleString()}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total sessions</p>
            </CardContent>
          </Card>

          {/* ETH Won */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">ETH Won</CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+{userStats.totalEthWon.toFixed(3)} ETH</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total winnings</p>
            </CardContent>
          </Card>

          {/* Net Profit/Loss */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Net P&L</CardTitle>
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  isProfit ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
                }`}
              >
                {isProfit ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isProfit ? "text-green-600" : "text-red-600"}`}>
                {isProfit ? "+" : ""}
                {netProfit.toFixed(3)} ETH
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{isProfit ? "Profit" : "Loss"} to date</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            size="lg"
            className="h-16 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <Play className="mr-2 h-5 w-5" />
            Start Game
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-16 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <User className="mr-2 h-5 w-5" />
            View Profile
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-16 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <Users className="mr-2 h-5 w-5" />
            Friends
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-16 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <Trophy className="mr-2 h-5 w-5" />
            Leaderboard
          </Button>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">First Win Streak</span>
                <Badge variant="secondary">Completed</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">High Roller</span>
                <Badge variant="outline">In Progress</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Lucky Seven</span>
                <Badge variant="secondary">Completed</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GamepadIcon className="h-5 w-5 text-blue-600" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Win Rate</span>
                <span className="font-semibold text-green-600">
                  {((userStats.totalEthWon / (userStats.totalEthWon + userStats.totalEthLost)) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg. Game Value</span>
                <span className="font-semibold">
                  {((userStats.totalEthWon + userStats.totalEthLost) / userStats.totalGamesPlayed).toFixed(4)} ETH
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Best Streak</span>
                <span className="font-semibold">12 wins</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
