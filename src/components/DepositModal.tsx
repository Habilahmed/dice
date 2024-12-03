import React, { useState } from 'react';
import { CreditCard, X } from 'lucide-react';

interface DepositModalProps {
  onDeposit: (amount: number) => void;
  onClose: () => void;
}

export default function DepositModal({ onDeposit, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState(100);
  const presetAmounts = [100, 250, 500, 1000];

  const handleDeposit = () => {
    if (amount > 0) {
      onDeposit(amount);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#161B22] rounded-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg hover:bg-purple-500/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold">Deposit</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              className="w-full bg-[#0D1117] border border-purple-500/20 rounded-lg px-4 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className="py-2 rounded-lg bg-[#0D1117] hover:bg-purple-500/10 transition-colors"
              >
                ${preset}
              </button>
            ))}
          </div>

          <button
            onClick={handleDeposit}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 font-bold transition-all"
          >
            Deposit
          </button>
        </div>
      </div>
    </div>
  );
}