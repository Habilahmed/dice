import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Minus } from 'lucide-react';
import { HistoryEntry } from '../App';
import RollAnimation from './RollAnimation';
import { formatNumber } from '../utils/format';
import useSound from '../hooks/useSound';

interface DiceGameProps {
  balance: number;
  onResult: (entry: HistoryEntry) => void;
}

function DiceGame({ balance, onResult }: DiceGameProps) {
  const [betAmount, setBetAmount] = useState(10);
  const [target, setTarget] = useState(50);
  const [isOver, setIsOver] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const { playSound } = useSound();

  const winChance = isOver ? (100 - target) : target;
  const multiplier = (99 / winChance).toFixed(4);
  const potentialWin = Math.floor(betAmount * Number(multiplier));

  const adjustTarget = (delta: number) => {
    const newTarget = Math.min(97, Math.max(3, target + delta));
    setTarget(newTarget);
    playSound('click');
  };

  const adjustBet = (amount: number) => {
    const newAmount = Math.max(0, Math.min(balance, betAmount + amount));
    setBetAmount(newAmount);
    playSound('click');
  };

  const handleRoll = () => {
    if (isRolling || betAmount > balance || betAmount <= 0) return;
    setIsRolling(true);
    playSound('roll');
    
    setTimeout(() => {
      const roll = Math.random() * 100;
      setLastRoll(roll);
      
      const won = isOver ? roll > target : roll < target;
      const payout = won ? potentialWin : 0;
      
      onResult({
        timestamp: new Date(),
        bet: betAmount,
        roll,
        target,
        isOver,
        multiplier: Number(multiplier),
        payout
      });

      setIsRolling(false);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6">
      {/* Main Game Area */}
      <div className="flex-1 bg-[#161B22] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
        <RollAnimation
          isRolling={isRolling}
          lastRoll={lastRoll}
          target={target}
          isOver={isOver}
        />
        
        {/* Compact Controls */}
        <div className="mt-8 max-w-2xl mx-auto space-y-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-2">Target</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustTarget(-1)}
                  className="p-2 rounded-lg bg-[#0D1117] hover:bg-[#1F2937] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Math.min(97, Math.max(3, Number(e.target.value))))}
                  className="flex-1 bg-[#0D1117] border border-purple-500/20 rounded-lg px-4 py-2 text-center"
                />
                
                <button
                  onClick={() => adjustTarget(1)}
                  className="p-2 rounded-lg bg-[#0D1117] hover:bg-[#1F2937] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-2">Bet Amount</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustBet(-10)}
                  className="p-2 rounded-lg bg-[#0D1117] hover:bg-[#1F2937] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.min(balance, Math.max(0, Number(e.target.value))))}
                  className="flex-1 bg-[#0D1117] border border-purple-500/20 rounded-lg px-4 py-2 text-center"
                />
                
                <button
                  onClick={() => adjustBet(10)}
                  className="p-2 rounded-lg bg-[#0D1117] hover:bg-[#1F2937] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex gap-2 flex-1">
              <button
                onClick={() => setIsOver(false)}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-1
                  ${!isOver ? 'bg-purple-500 text-white' : 'bg-[#0D1117] hover:bg-[#1F2937]'}`}
              >
                <ArrowDown className="w-4 h-4" /> Under
              </button>
              <button
                onClick={() => setIsOver(true)}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-1
                  ${isOver ? 'bg-purple-500 text-white' : 'bg-[#0D1117] hover:bg-[#1F2937]'}`}
              >
                <ArrowUp className="w-4 h-4" /> Over
              </button>
            </div>

            <div className="flex gap-2 flex-1">
              <button
                onClick={() => setBetAmount(Math.floor(balance * 0.5))}
                className="flex-1 px-4 py-2 rounded-lg bg-[#0D1117] hover:bg-[#1F2937] transition-colors text-sm"
              >
                50%
              </button>
              <button
                onClick={() => setBetAmount(balance)}
                className="flex-1 px-4 py-2 rounded-lg bg-[#0D1117] hover:bg-[#1F2937] transition-colors text-sm"
              >
                Max
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center bg-[#0D1117] rounded-lg p-4">
            <div>
              <div className="text-gray-400 text-sm mb-1">Win Chance</div>
              <div className="font-bold">{winChance.toFixed(2)}%</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Multiplier</div>
              <div className="font-bold">{multiplier}x</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Potential Win</div>
              <div className="font-bold">{formatNumber(potentialWin)}</div>
            </div>
          </div>

          <button
            onClick={handleRoll}
            disabled={isRolling || betAmount <= 0 || betAmount > balance}
            className={`w-full py-4 rounded-lg text-lg font-bold transition-all
              ${isRolling || betAmount <= 0 || betAmount > balance
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/20'
              }`}
          >
            {isRolling ? 'Rolling...' : 'Roll'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiceGame;