import React , { useEffect, useState } from "react"
import DashboardCard from "./DashboardCard"
import { jwtDecode } from 'jwt-decode';
import { ethers } from 'ethers';
import axios from 'axios';
import { getCookie } from '../utils/Cookies';
import { Wallet, Gamepad2Icon as GameController2, TrendingUp, Trophy , X} from "lucide-react"

export interface JwtPayload {
  username: string;
  email: string;
  wallet_address: string;
}

type Match = {
  id: number;
  player1_id: number;
  player2_id: number;
  winner_id: number;
  stake_amount: string; // in ETH string
  completed_at: string; // ISO date
};

const DashboardCards: React.FC =  () => {
  const [balance, setBalance] = useState<string>("Loading...");
  const [balance2, setBalance2] = useState<string>("Loading...");
  const [UserGames, setUserGames] = useState<Match[]>();
  const [UserID, setUserID] = useState<number>();
  const [TotalGames, setTotalGames] = useState<number>(0);
  const [WinRate, setWinRate] = useState<string>("0");
  const [EthWon, setEthWon] = useState<number>(0);
  const [EthLost, setEthLost] = useState<number>(0);
  const [LastGameResult, setLastGameResult] = useState<string>("---");
  const [LastGameAmount, setLastGameAmount] = useState<string>("---");



  useEffect(() => {
    async function fetchBalance() {
      try {
        const token = getCookie("jwt");
        if (!token) return;

        const decoded: JwtPayload = jwtDecode(token);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balanceBigInt = await provider.getBalance(decoded.wallet_address);
        const balanceInEth = ethers.formatEther(balanceBigInt);
        const balanceInGwei = ethers.formatUnits(balanceBigInt, 'gwei');
        setBalance(balanceInEth);
        setBalance2(balanceInGwei);
      } catch (err) {
        console.error("Failed to fetch balance:", err);
        setBalance("Error");
      }
    }

    async function get_data() {
      axios.post<Match[]>(
        `${import.meta.env.VITE_SERVER_API_URL}/data`,
        {}, { withCredentials: true }
      ).then(res =>{
        const data = res.data;
        setUserID(data[data.length-1].id);
        data.pop();
        setUserGames(data);

      })
    }

    fetchBalance();
    get_data();
  }, []);


  useEffect(() => {
    if(!UserGames || UserGames.length === 0) return;

    setTotalGames(UserGames.length);

    const wins = UserGames.filter(match => match.winner_id === UserID);
    const losses = UserGames.filter(match => (match.winner_id !== UserID && match.winner_id !== 0));
    setWinRate(((wins.length / UserGames.length) * 100).toFixed(2));

    const totalEthWon = wins.reduce((sum, match) => sum + ((1.8)*parseFloat(match.stake_amount)), 0);
    const totalEthLost = losses.reduce((sum, match) => sum + parseFloat(match.stake_amount), 0);
    setEthWon(totalEthWon);
    setEthLost(totalEthLost);

    const lastMatch = UserGames.sort(
      (a, b) => b.id - a.id
    )[0];
    if(lastMatch) setLastGameResult(lastMatch.winner_id === UserID ? "Victory" : lastMatch.winner_id === 0 ? "Tie" : "Defeat");
    else setLastGameResult("---");
    if(lastMatch) setLastGameAmount(lastMatch.stake_amount);
    else setLastGameAmount("---");

  },[UserGames]);

  const cards = [
    {
      title: "ETH Balance",
      value: `${balance} ETH`,
      subtitle: `${balance2} gwei`,
      icon: Wallet,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      title: "Games Played",
      value:  `${TotalGames}`,
      subtitle: `Win Rate: ${WinRate}%`,
      icon: GameController2,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      title: "Total ETH Won",
      value: `${EthWon} ETH`,
      subtitle: `Lost: ${EthLost} ETH`,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/30",
    },
    {
      title: "Last Match",
      value: `${LastGameResult}`,
      subtitle:  (LastGameResult == "Victory" ? `Won: ${LastGameAmount} ETH` : LastGameResult == "Tie" ? "Match Draw" : `Loss: ${LastGameAmount} ETH`),
      icon: (LastGameResult == "Victory" ? Trophy : LastGameResult == "Tie" ? X : X),
      color: (LastGameResult == "Victory" ? "from-yellow-500 to-orange-500" : LastGameResult == "Tie" ? "from-blue-500 to-cyan-500" : "from-red-800 to-red-400" ),
      bgColor:  (LastGameResult == "Victory" ? "from-yellow-500/10 to-orange-500/10" : LastGameResult == "Tie" ? "from-blue-500/10 to-cyan-500/10" : "from-red-800/10 to-red-400/10" ),
      borderColor: "border-yellow-500/30",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <DashboardCard key={index} {...card} />
      ))}
    </section>
  )
}

export default DashboardCards
