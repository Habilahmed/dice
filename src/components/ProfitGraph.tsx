import React, { useState } from 'react';
import { TrendingUp, GripHorizontal, Minimize2 } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import Draggable from 'react-draggable';
import { formatNumber } from '../utils/format';
import { HistoryEntry } from '../App';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ScriptableContext
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

interface ProfitGraphProps {
  history: HistoryEntry[];
  onClose: () => void;
}

interface DataPoint {
  timestamp: string;
  profit: number;
  isPositive: boolean;
}

export default function ProfitGraph({ history, onClose }: ProfitGraphProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Process data
  const data = history
    .slice()
    .reverse()
    .reduce((acc: { profit: number; data: DataPoint[] }, entry) => {
      const profit = entry.payout - entry.bet;
      acc.profit += profit;
      acc.data.push({
        timestamp: entry.timestamp.toISOString(),
        profit: Number(acc.profit.toFixed(2)),
        isPositive: acc.profit >= 0
      });
      return acc;
    }, { profit: 0, data: [] }).data;

  const totalProfit = data[data.length - 1]?.profit ?? 0;
  const totalWagered = history.reduce((sum, entry) => sum + entry.bet, 0);
  const wins = history.filter(entry => entry.payout > entry.bet).length;
  const losses = history.filter(entry => entry.payout === 0).length;

  // Chart.js data configuration
  const chartData = {
    labels: data.map(d => d.timestamp),
    datasets: [{
      data: data.map(d => d.profit),
      segment: {
        borderColor: (ctx: ScriptableContext<'line'>) => {
          const currentProfit = data[ctx.p0DataIndex].profit;
          return currentProfit >= 0 ? '#4ade80' : '#ef4444';
        }
      },
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.1,
      borderJoinStyle: 'round',
    }]
  };

  // Chart.js options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 
    },
    transitions: {
      active: {
        animation: {
          duration: 0 
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    events: [], 
    scales: {
      x: { 
        display: false,
      },
      y: { 
        display: false,
        beginAtZero: true
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false 
      }
    }
  };

  return (
    <Draggable
      handle=".drag-handle"
      position={position}
      onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
      bounds="parent"
    >
      <div className="absolute z-50 bg-[#0D1117] rounded-xl p-4 w-64 shadow-lg shadow-black/25 cursor-default border border-purple-500/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="drag-handle cursor-move p-1 hover:bg-purple-500/10 rounded-lg">
            <GripHorizontal className="w-4 h-4 text-gray-400" />
          </div>
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <span className="font-semibold">Live Stats</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-purple-500/10 rounded-lg ml-auto"
            title="Close"
          >
            <Minimize2 className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="bg-[#161B22] rounded-lg p-3 mb-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Profit</div>
              <div className={`font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalProfit >= 0 ? '+' : ''}{formatNumber(totalProfit)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Wins</div>
              <div className="font-bold text-white">{wins}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Wagered</div>
              <div className="font-bold text-white">${formatNumber(totalWagered)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Losses</div>
              <div className="font-bold text-white">{losses}</div>
            </div>
          </div>
        </div>

        <div className="h-24 w-full min-h-[96px] min-w-[200px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </Draggable>
  );
}
