import type React from "react"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BrowserProvider, parseEther } from 'ethers';
import { jwtDecode } from 'jwt-decode';
import { getCookie } from '../utils/Cookies';
import { Link } from "react-router";
import { Zap, Users, Trophy } from "lucide-react"

interface JwtPayload {
  id: string;
  username: string;
  email: string;
  wallet_address: string;
}

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const token = getCookie('jwt');
  if (!token) return null;
  const decoded: JwtPayload = jwtDecode(token);
  const username = decoded.username;

  const handleStart = async () => {
    try{
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }
      // Create a new ethers provider and signer
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: import.meta.env.VITE_ADMIN_WALLET_ADDRESS,
        value: parseEther("0.001"),
      });

      console.log("Transaction sent:", tx.hash);

      await tx.wait(); // Wait for confirmation

      await axios.post<string>(
        'http://localhost:3000/set-loading',
        { txHash: tx.hash },
        { withCredentials: true }
      ).then(res =>{
        console.log("Gaming session started:", res.data);
        navigate('/loading');
      })
      .catch(() => {
        navigate('/home');
      });

    } catch (error: any) {
      console.error("Payment error:", error);
      alert(`Payment failed: ${error.message || error}`);
    }
  };

  return (
    <section className="relative py-20 px-4">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-green-600/20 rounded-3xl blur-3xl animate-pulse"></div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-sm font-medium mb-4 font-cyber tracking-wide">
            WELCOME BACK TO THE ARENA, {username.toLocaleUpperCase()}!
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent font-cyber tracking-wider">
          READY TO BATTLE?
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Stake ETH, challenge opponents, and prove your skills in the ultimate blockchain gaming arena.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button onClick={handleStart} className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-2">
              <Zap size={24} />
              <span>Start New Game</span>
            </div>
          </button>

          <Link to="/friends" className="group relative px-8 py-4 bg-gray-800/50 border border-purple-500/30 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:border-purple-400/50 hover:bg-gray-700/50">
            <div className="flex items-center space-x-2">
              <Users size={24} />
              <span>Checkout Friends</span>
            </div>
          </Link>

          <Link to="/leaderboard" className="group relative px-8 py-4 bg-gray-800/50 border border-green-500/30 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:border-green-400/50 hover:bg-gray-700/50">
            <div className="flex items-center space-x-2">
              <Trophy size={24} />
              <span>View Leaderboard</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
