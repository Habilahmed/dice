import React, { useState, useEffect } from 'react';

interface RollAnimationProps {
  isRolling: boolean;
  lastRoll: number | null;
  target: number;
  isOver: boolean;
}

function RollAnimation({ isRolling, lastRoll, target, isOver }: RollAnimationProps) {
  const [animationValue, setAnimationValue] = useState(50);

  useEffect(() => {
    if (isRolling) {
      setAnimationValue(lastRoll || 50);
    } else if (lastRoll !== null) {
      setAnimationValue(lastRoll);
    }
  }, [isRolling, lastRoll]);

  const getResultColor = () => {
    if (lastRoll === null || isRolling) return 'text-white';
    const won = isOver ? lastRoll > target : lastRoll < target;
    return won ? 'text-purple-400' : 'text-red-400';
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl mx-auto">
        <div className="relative h-32 bg-[#0D1117] rounded-2xl overflow-hidden mb-6">
          {/* Losing zone */}
          <div
            className="absolute top-0 h-full bg-black/50"
            style={{ 
              left: isOver ? '0%' : `${target}%`,
              width: isOver ? `${target}%` : `${100 - target}%`
            }}
          />
          
          {/* Winning zone */}
          <div
            className="absolute top-0 h-full bg-purple-500/20"
            style={{ 
              left: isOver ? `${target}%` : '0%',
              width: isOver ? `${100 - target}%` : `${target}%`
            }}
          />
          
          {/* Target line */}
          <div
            className="absolute top-0 h-full w-0.5 bg-purple-500"
            style={{ left: `${target}%` }}
          />
          
          {/* Roll indicator */}
          <div
            className={`absolute top-0 h-full w-2 ${
              isRolling ? 'bg-white' : 
                lastRoll !== null ? (
                  isOver ? 
                    (lastRoll > target ? 'bg-purple-400' : 'bg-red-400') :
                    (lastRoll < target ? 'bg-purple-400' : 'bg-red-400')
                ) : 'bg-white'
            }`}
            style={{ 
              left: `${animationValue}%`,
              transition: 'all 0.2s ease-out'
            }}
          />
          
          {/* Win/Lose zone labels */}
          <div className="absolute top-2 left-2 text-sm font-medium text-gray-400">
            {isOver ? 'LOSE' : 'WIN'}
          </div>
          <div className="absolute top-2 right-2 text-sm font-medium text-gray-400">
            {isOver ? 'WIN' : 'LOSE'}
          </div>
        </div>
        
        {/* Roll value display */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xl">0</span>
          <div className="text-center">
            <span className={`text-6xl font-bold ${getResultColor()} transition-colors duration-300`}>
              {isRolling ? 'Rolling...' : lastRoll?.toFixed(2) ?? '0.00'}
            </span>
            {!isRolling && lastRoll !== null && (
              <div className={`text-sm mt-2 ${getResultColor()}`}>
                {isOver ? 
                  (lastRoll > target ? 'WIN!' : 'LOSE') :
                  (lastRoll < target ? 'WIN!' : 'LOSE')}
              </div>
            )}
          </div>
          <span className="text-gray-400 text-xl">100</span>
        </div>
      </div>
    </div>
  );
}

export default RollAnimation;