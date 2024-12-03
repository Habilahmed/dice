import React, { useState } from 'react';
import { Coins, History, Volume2, VolumeX, Wallet, TrendingUp } from 'lucide-react';
import DiceGame from './components/DiceGame';
import GameHistory from './components/GameHistory';
import ProfitGraph from './components/ProfitGraph';
import useSound from './hooks/useSound';
import { formatNumber } from './utils/format';
import PhoneVerification from './components/PhoneVerification';
import DepositModal from './components/DepositModal';

const INITIAL_BALANCE = 1000;

export type HistoryEntry = {
  timestamp: Date;
  bet: number;
  roll: number;
  target: number;
  isOver: boolean;
  multiplier: number;
  payout: number;
};

function App() {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showProfitGraph, setShowProfitGraph] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const { playSound, toggleMute, isMuted } = useSound();

  const handleResult = (entry: HistoryEntry) => {
    setBalance(prev => prev - entry.bet + entry.payout);
    setHistory(prev => [entry, ...prev].slice(0, 50));
    playSound(entry.payout > entry.bet ? 'win' : 'lose');
  };

  const handleDeposit = (amount: number) => {
    setBalance(prev => prev + amount);
    playSound('win');
  };

  const handleDepositClick = () => {
    if (!isPhoneVerified) {
      setShowPhoneVerification(true);
    } else {
      setShowDepositModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="bg-[#161B22] border-b border-purple-500/10 px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            Dice
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDepositClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-colors font-semibold"
            >
              <Wallet className="w-4 h-4" />
              Deposit
            </button>
            <button
              onClick={() => setShowProfitGraph(!showProfitGraph)}
              className="p-2 rounded-lg hover:bg-purple-500/10 transition-colors"
              title="Profit/Loss Graph"
            >
              <TrendingUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-lg hover:bg-purple-500/10 transition-colors"
              title="Game History"
            >
              <History className="w-5 h-5" />
            </button>
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg hover:bg-purple-500/10 transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 bg-[#0D1117] px-4 py-2 rounded-lg">
              <Coins className="w-5 h-5 text-purple-400" />
              <span className="font-bold">{formatNumber(balance)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6 flex gap-6">
        <DiceGame
          balance={balance}
          onResult={handleResult}
        />
        
        {showHistory && (
          <div className="w-80 flex-shrink-0">
            <GameHistory history={history} />
          </div>
        )}
      </div>

      {/* Floating Profit Graph */}
      {showProfitGraph && (
        <ProfitGraph 
          history={history} 
          onClose={() => setShowProfitGraph(false)} 
        />
      )}

      {/* Modals */}
      {showPhoneVerification && (
        <PhoneVerification
          onVerified={() => {
            setIsPhoneVerified(true);
            setShowPhoneVerification(false);
            setShowDepositModal(true);
          }}
          onClose={() => setShowPhoneVerification(false)}
        />
      )}

      {showDepositModal && (
        <DepositModal
          onDeposit={handleDeposit}
          onClose={() => setShowDepositModal(false)}
        />
      )}
    </div>
  );
}

export default App;