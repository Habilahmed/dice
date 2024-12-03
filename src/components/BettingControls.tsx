import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface BettingControlsProps {
  balance: number;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  targetNumber: number;
  setTargetNumber: (number: number) => void;
  onRoll: () => void;
  disabled: boolean;
}

function BettingControls({
  balance,
  betAmount,
  setBetAmount,
  targetNumber,
  setTargetNumber,
  onRoll,
  disabled
}: BettingControlsProps) {
  const adjustBet = (amount: number) => {
    const newAmount = Math.max(0, Math.min(balance, betAmount + amount));
    setBetAmount(newAmount);
  };

  const multiplier = (6 / (7 - targetNumber)).toFixed(2);
  const potentialWin = Math.floor(betAmount * Number(multiplier));

  return (
    <div className="space-y-6 mt-8">
      <div className="space-y-2">
        <label className="block text-sm text-gray-300">Target Number (Roll this or higher to win)</label>
        <div className="flex gap-2">
          {[2, 3, 4, 5, 6].map(num => (
            <button
              key={num}
              onClick={() => setTargetNumber(num)}
              className={`w-12 h-12 rounded-lg font-bold text-lg transition-all
                ${targetNumber === num
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 hover:bg-white/20'
                }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-gray-300">Bet Amount</label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => adjustBet(-10)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Minus className="w-5 h-5" />
          </button>
          
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Math.min(balance, Math.max(0, Number(e.target.value))))}
            className="w-32 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center"
          />
          
          <button
            onClick={() => adjustBet(10)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setBetAmount(Math.floor(balance * 0.5))}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              50%
            </button>
            <button
              onClick={() => setBetAmount(balance)}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-400 bg-white/5 rounded-lg p-4">
        <span>Multiplier: {multiplier}x</span>
        <span>Potential Win: {potentialWin}</span>
      </div>

      <button
        onClick={onRoll}
        disabled={disabled || betAmount <= 0 || betAmount > balance}
        className={`w-full py-4 rounded-lg text-lg font-bold transition-all
          ${disabled || betAmount <= 0 || betAmount > balance
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
          }`}
      >
        {disabled ? 'Rolling...' : 'Roll Dice'}
      </button>
    </div>
  );
}

export default BettingControls;