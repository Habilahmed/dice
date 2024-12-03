import React from 'react';
import { HistoryEntry } from '../App';
import { formatNumber } from '../utils/format';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface GameHistoryProps {
  history: HistoryEntry[];
}

function GameHistory({ history }: GameHistoryProps) {
  const cumulativeData = history
    .slice()
    .reverse()
    .reduce((acc: { profit: number; data: any[] }, entry, index) => {
      const profit = entry.payout - entry.bet;
      acc.profit += profit;
      acc.data.push({
        index,
        profit: acc.profit,
        timestamp: entry.timestamp.toLocaleTimeString(),
      });
      return acc;
    }, { profit: 0, data: [] }).data;

  return (
    <div className="bg-[#161B22] rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-bold mb-4">Game History</h2>
      
      {/* Profit/Loss Graph */}
      {history.length > 0 && (
        <div className="h-48 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cumulativeData}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="index" hide />
              <YAxis hide />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0D1117] border border-purple-500/20 rounded-lg p-2 text-sm">
                        <p className="text-gray-400">{payload[0].payload.timestamp}</p>
                        <p className={payload[0].value >= 0 ? 'text-green-400' : 'text-red-400'}>
                          Profit: {formatNumber(payload[0].value)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="rgb(168, 85, 247)"
                fill="url(#profitGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* History List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
        {history.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No games played yet</p>
        ) : (
          history.map((entry, index) => {
            const won = entry.isOver ? entry.roll > entry.target : entry.roll < entry.target;
            return (
              <div
                key={index}
                className={`relative bg-[#0D1117] rounded-lg p-3 space-y-2 border-2 transition-colors ${
                  won ? 'border-green-500/20 hover:border-green-500/40' : 'border-red-500/20 hover:border-red-500/40'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${won ? 'text-green-400' : 'text-red-400'}`}>
                      {entry.roll.toFixed(2)}
                    </span>
                    <span className="text-gray-400 flex items-center gap-1">
                      {entry.isOver ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                      {entry.target}
                    </span>
                  </div>
                  <div className={`font-bold ${won ? 'text-green-400' : 'text-red-400'}`}>
                    {won ? '+' : ''}{formatNumber(entry.payout - entry.bet)}
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{entry.timestamp.toLocaleTimeString()}</span>
                  <span>{entry.multiplier}x</span>
                </div>
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
                  won ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default GameHistory;