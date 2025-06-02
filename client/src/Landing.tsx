import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
  // Simulating navigation for demo purposes
  const navigate = (path: string) => console.log(`Navigating to: ${path}`);

  useEffect(() => {
    console.log("called");
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
    const token = localStorage.getItem('jwt');
    if (!token) {
      navigate('/');
      return;
    }

    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed!');
      return;
    }
    
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const address = accounts[0];
    
    console.log(token);
    const res = await axios.post<string>(
      'http://localhost:3000/auth/metamask',
      { token, address }
    );

    const new_token  = res.data;
    localStorage.setItem('jwt', new_token);
    console.log('Connected account:', address);

    navigate('/home');
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
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden overflow-y-auto">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 69, 193, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 69, 193, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Floating Orbs */}
        <div className="absolute top-10 left-10 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-20 w-24 h-24 md:w-40 md:h-40 lg:w-56 lg:h-56 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-28 h-28 md:w-44 md:h-44 lg:w-60 lg:h-60 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-15 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-10 w-36 h-36 md:w-52 md:h-52 lg:w-72 lg:h-72 xl:w-96 xl:h-96 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
        
        {/* Additional floating elements for larger screens */}
        <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 xl:w-56 xl:h-56 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header Section */}
        <header className="flex-shrink-0 pt-8 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-24 pb-6 sm:pb-8 md:pb-12 lg:pb-16 text-center px-4 sm:px-6 md:px-8">
          <div className="animate-fade-in max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8 md:mb-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-18 lg:h-18 bg-white rounded-full flex items-center justify-center">
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">C</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight mb-3 sm:mb-4 md:mb-6">
                CodeNebula
              </h1>
              <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 mx-auto rounded-full" />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto w-full text-center">
            
            {/* Main Headline */}
            <section className="mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-28">
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black text-white leading-tight">
                    Battle{' '}
                    <span className="relative inline-block">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                        1v1
                      </span>
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-red-500 opacity-20 blur-lg rounded-lg"></div>
                    </span>
                  </h2>
                  
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-white">
                    Win{' '}
                    <span className="relative inline-block">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500">
                        ETH
                      </span>
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-teal-500 opacity-20 blur-lg rounded-lg"></div>
                    </span>
                  </h3>
                </div>
                
                <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-gray-300 font-bold mb-6 sm:mb-8 md:mb-10">
                    Powered by{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500">
                      AI
                    </span>
                  </p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-400 max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto leading-relaxed font-medium">
                    Enter the ultimate blockchain gaming arena where skill meets strategy. Compete in AI-powered battles and earn real ETH rewards in the most immersive crypto gaming experience.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA Button Section */}
            <section className="mb-16 sm:mb-20 md:mb-24 lg:mb-28 xl:mb-32">
              <div className="animate-fade-in max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto" style={{ animationDelay: '0.4s' }}>
                <button
                  onClick={handleButtonClick}
                  disabled={isConnecting}
                  className="group relative w-full px-8 sm:px-10 md:px-12 lg:px-16 xl:px-20 py-4 sm:py-5 md:py-6 lg:py-7 xl:py-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-2xl md:rounded-3xl font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl transition-all duration-500 text-white hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-70 disabled:cursor-not-allowed transform hover:rotate-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-2xl md:rounded-3xl" />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl md:rounded-3xl" />
                  <div className="relative flex items-center space-x-3 sm:space-x-4 justify-center">
                    {isConnecting ? (
                      <>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <span>{getButtonLabel()}</span>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full opacity-75 group-hover:animate-ping" />
                      </>
                    )}
                  </div>
                </button>
                <p className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mt-4 sm:mt-5 md:mt-6 lg:mt-8 text-center font-medium">
                  🚀 Ready to battle and earn ETH rewards?
                </p>
              </div>
            </section>

            {/* Enhanced Stats Section */}
            <section className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
              <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <h4 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                  Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Revolution</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 max-w-7xl mx-auto">
                  <div className="group text-center p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:bg-gradient-to-br hover:from-white/20 hover:to-white/10 transition-all duration-500 hover:scale-105 hover:-translate-y-2 shadow-2xl">
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-2 sm:mb-3 md:mb-4 lg:mb-6">$50K+</div>
                    <div className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold">ETH Distributed</div>
                    <div className="mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg text-gray-400">Real rewards, real winners</div>
                  </div>
                  <div className="group text-center p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:bg-gradient-to-br hover:from-white/20 hover:to-white/10 transition-all duration-500 hover:scale-105 hover:-translate-y-2 shadow-2xl">
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 mb-2 sm:mb-3 md:mb-4 lg:mb-6">10K+</div>
                    <div className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold">Active Players</div>
                    <div className="mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg text-gray-400">Growing community</div>
                  </div>
                  <div className="group text-center p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:bg-gradient-to-br hover:from-white/20 hover:to-white/10 transition-all duration-500 hover:scale-105 hover:-translate-y-2 shadow-2xl sm:col-span-1">
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2 sm:mb-3 md:mb-4 lg:mb-6">99.9%</div>
                    <div className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold">Uptime</div>
                    <div className="mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg text-gray-400">Always available</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="mb-16 sm:mb-20 md:mb-24">
              <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 max-w-6xl mx-auto">
                  <div className="text-center p-6 sm:p-8 md:p-10 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">⚡</div>
                    <h5 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">Lightning Fast</h5>
                    <p className="text-sm sm:text-base md:text-lg text-gray-400">Instant battles, real-time rewards</p>
                  </div>
                  <div className="text-center p-6 sm:p-8 md:p-10 rounded-2xl bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20">
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">🛡️</div>
                    <h5 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">Secure & Fair</h5>
                    <p className="text-sm sm:text-base md:text-lg text-gray-400">Blockchain-powered transparency</p>
                  </div>
                  <div className="text-center p-6 sm:p-8 md:p-10 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 md:col-span-2 lg:col-span-1">
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">🎮</div>
                    <h5 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">AI Powered</h5>
                    <p className="text-sm sm:text-base md:text-lg text-gray-400">Advanced AI opponents & matchmaking</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 pb-8 sm:pb-12 md:pb-16 lg:pb-20 text-center px-4 sm:px-6 md:px-8">
          <div className="animate-fade-in" style={{ animationDelay: '1s' }}>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-500 mb-4 sm:mb-6">
              © 2025 CryptoArena. The future of blockchain gaming is here.
            </p>
            <div className="flex justify-center space-x-6 sm:space-x-8 md:space-x-10">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <span className="text-sm sm:text-base md:text-lg">🐦</span>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <span className="text-sm sm:text-base md:text-lg">💬</span>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <span className="text-sm sm:text-base md:text-lg">📱</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;