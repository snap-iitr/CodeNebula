import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, Gamepad2 } from "lucide-react"

interface IndexProps {
  status: 0 | 1 | 2; // 0 = Google, 1 = MetaMask, 2 = Redirect
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const Landing: React.FC<IndexProps> = ({ status = 0 }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 2) {
      navigate('/home');
    }
  }, [status]);

  const handleGoogleLogin = () => {
    console.log('Google login initiated');
    window.location.href = 'http://localhost:3000/auth/google';
  };

const handleMetaMaskConnect = async () => {
  setIsConnecting(true);

  try {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed!');
      return;
    }
    
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const address = accounts[0];
    
    axios.post<string>(
      'http://localhost:3000/auth/metamask',
      { address }, { withCredentials: true }
    ).then(res =>{
      const new_token  = res.data;
      document.cookie = `jwt=${new_token}`;
      console.log('Connected account:', address);
      navigate('/home');
    })
    .catch(() => {
        navigate('/');
    })

  } catch (error) {
    console.error('Error during MetaMask connect:', error);
    navigate('/');
  } finally {
    setIsConnecting(false);
  }
};

  const handleButtonClick = () => {
    if (status === 0) {
      handleGoogleLogin();
    } else if (status === 1) {
      handleMetaMaskConnect();
    }
  };

  const getButtonLabel = (): string => {
    switch (status) {
      case 0:
        return 'Login with Google';
      case 1:
        return 'Connect MetaMask';
      default:
        return 'Continue';
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-x-hidden overflow-y-auto">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full animate-pulse"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Additional floating elements for larger screens */}
        <div
          className="hidden lg:block absolute top-1/4 left-1/4 w-40 h-40 xl:w-56 xl:h-56 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="hidden lg:block absolute bottom-1/4 right-1/4 w-32 h-32 xl:w-48 xl:h-48 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header Section */}
        <header className="flex-shrink-0 pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-3 sm:pb-4 md:pb-6 lg:pb-8 text-center px-4">
          <div className="animate-fade-in max-w-7xl mx-auto">
            <div className="mb-3 sm:mb-4 md:mb-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto mb-2 sm:mb-3 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center">
                  <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    E
                  </span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight mb-2 font-cyber tracking-wider">
                ETH BATTLE ARENA
              </h1>
              <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 w-24 sm:w-32 md:w-40 lg:w-48 mx-auto rounded-full" />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
          <div className="max-w-7xl mx-auto w-full text-center">
            {/* Main Headline */}
            <section className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5 mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight font-cyber tracking-wider">
                    BATTLE{" "}
                    <span className="relative inline-block">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                        1V1
                      </span>
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-red-500 opacity-20 blur-lg rounded-lg"></div>
                    </span>
                  </h2>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white font-cyber tracking-wider">
                    WIN{" "}
                    <span className="relative inline-block">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500">
                        ETH
                      </span>
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-teal-500 opacity-20 blur-lg rounded-lg"></div>
                    </span>
                  </h3>
                </div>

                <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 font-bold mb-3 sm:mb-4 md:mb-5 font-cyber tracking-wide">
                    POWERED BY{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500">
                      AI
                    </span>
                  </p>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto leading-relaxed font-medium">
                    Enter the ultimate blockchain gaming arena where skill meets strategy. Compete in head-to-head ETH
                    battles, stake cryptocurrency, and prove your dominance in the most immersive Web3 gaming
                    experience.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA Button Section - reduce size and spacing */}
            <section className="mb-8 sm:mb-10 md:mb-12 lg:mb-14">
              <div
                className="animate-fade-in max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
                style={{ animationDelay: "0.4s" }}
              >
                <button
                  onClick={handleButtonClick}
                  disabled={isConnecting}
                  className="group relative w-full px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-xl font-bold text-sm sm:text-base md:text-lg lg:text-xl transition-all duration-500 text-white hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-70 disabled:cursor-not-allowed transform hover:rotate-1 font-cyber tracking-wider"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-xl" />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl" />
                  <div className="relative flex items-center space-x-3 justify-center">
                    {isConnecting ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>CONNECTING...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        <span>{getButtonLabel()}</span>
                        <div className="w-2 h-2 bg-white rounded-full opacity-75 group-hover:animate-ping" />
                      </>
                    )}
                  </div>
                </button>
                <p className="text-gray-300 text-xs sm:text-sm md:text-base mt-2 sm:mt-3 md:mt-4 text-center font-medium">
                  🚀 Ready to battle and earn ETH rewards?
                </p>
              </div>
            </section>

            {/* Enhanced Stats Section - reduce size and spacing */}
            <section className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <h4 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-5 md:mb-6 lg:mb-8 font-cyber tracking-wider">
                  JOIN THE{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                    REVOLUTION
                  </span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-7xl mx-auto">
                  <div className="group text-center p-4 sm:p-5 md:p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-green-500/30 hover:border-green-400/50 hover:bg-gray-700/50 transition-all duration-500 hover:scale-105 hover:-translate-y-1 shadow-xl">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-1 sm:mb-2">
                      $50K+
                    </div>
                    <div className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
                      ETH Distributed
                    </div>
                    <div className="mt-1 sm:mt-2 text-xs md:text-sm text-gray-400">Real rewards, real winners</div>
                  </div>
                  <div className="group text-center p-4 sm:p-5 md:p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-blue-500/30 hover:border-blue-400/50 hover:bg-gray-700/50 transition-all duration-500 hover:scale-105 hover:-translate-y-1 shadow-xl">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 mb-1 sm:mb-2">
                      10K+
                    </div>
                    <div className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
                      Active Players
                    </div>
                    <div className="mt-1 sm:mt-2 text-xs md:text-sm text-gray-400">Growing community</div>
                  </div>
                  <div className="group text-center p-4 sm:p-5 md:p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 hover:bg-gray-700/50 transition-all duration-500 hover:scale-105 hover:-translate-y-1 shadow-xl sm:col-span-1">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-1 sm:mb-2">
                      99.9%
                    </div>
                    <div className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg font-semibold">Uptime</div>
                    <div className="mt-1 sm:mt-2 text-xs md:text-sm text-gray-400">Always available</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section - reduce size and spacing */}
            <section className="mb-8 sm:mb-10 md:mb-12">
              <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 max-w-6xl mx-auto">
                  <div className="text-center p-4 sm:p-5 md:p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg inline-block mb-2 sm:mb-3">
                      <Zap size={24} className="text-white" />
                    </div>
                    <h5 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2 font-cyber tracking-wide">
                      LIGHTNING FAST
                    </h5>
                    <p className="text-xs sm:text-sm md:text-base text-gray-400">Instant battles, real-time rewards</p>
                  </div>
                  <div className="text-center p-4 sm:p-5 md:p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg inline-block mb-2 sm:mb-3">
                      <Shield size={24} className="text-white" />
                    </div>
                    <h5 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2 font-cyber tracking-wide">
                      SECURE & FAIR
                    </h5>
                    <p className="text-xs sm:text-sm md:text-base text-gray-400">Blockchain-powered transparency</p>
                  </div>
                  <div className="text-center p-4 sm:p-5 md:p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 md:col-span-2 lg:col-span-1">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg inline-block mb-2 sm:mb-3">
                      <Gamepad2 size={24} className="text-white" />
                    </div>
                    <h5 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2 font-cyber tracking-wide">
                      AI POWERED
                    </h5>
                    <p className="text-xs sm:text-sm md:text-base text-gray-400">Advanced AI opponents & matchmaking</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 pb-4 sm:pb-6 md:pb-8 text-center px-4">
          <div className="animate-fade-in" style={{ animationDelay: "1s" }}>
            <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
              © 2025 ETH Battle Arena. The future of blockchain gaming is here.
            </p>
            <div className="flex justify-center space-x-4 sm:space-x-5">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-800/50 border border-purple-500/30 rounded-full flex items-center justify-center hover:border-purple-400/50 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer">
                <span className="text-xs sm:text-sm">🐦</span>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-800/50 border border-purple-500/30 rounded-full flex items-center justify-center hover:border-purple-400/50 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer">
                <span className="text-xs sm:text-sm">💬</span>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-800/50 border border-purple-500/30 rounded-full flex items-center justify-center hover:border-purple-400/50 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer">
                <span className="text-xs sm:text-sm">📱</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;