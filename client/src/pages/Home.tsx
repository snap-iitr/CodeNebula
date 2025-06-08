import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import DashboardCards from "../components/DashboardCards"
import QuickActions from "../components/QuickActions"
import OnlineFriends from "../components/OnlineFriends"
// import RecentMatches from "../components/RecentMatches"
import "../styles/Home.css"

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-x-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 py-8 space-y-12">
          <Hero />
          <DashboardCards />
          <QuickActions />
          <OnlineFriends />
          {/* <RecentMatches /> */}
        </main>
      </div>
    </div>
  )
}

export default App
