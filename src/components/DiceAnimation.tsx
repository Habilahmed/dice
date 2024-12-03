import React from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

interface DiceAnimationProps {
  isRolling: boolean;
  currentRoll: number | null;
  targetNumber: number;
}

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

function DiceAnimation({ isRolling, currentRoll, targetNumber }: DiceAnimationProps) {
  const [animationFrame, setAnimationFrame] = React.useState(0);

  React.useEffect(() => {
    if (isRolling) {
      const interval = setInterval(() => {
        setAnimationFrame(prev => (prev + 1) % 6);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRolling]);

  const DiceIcon = isRolling
    ? diceIcons[animationFrame]
    : currentRoll
    ? diceIcons[currentRoll - 1]
    : diceIcons[0];

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div
        className={`transform transition-all duration-300 ${
          isRolling ? 'animate-bounce scale-110' : ''
        }`}
      >
        <DiceIcon
          className={`w-32 h-32 ${
            !isRolling && currentRoll
              ? currentRoll >= targetNumber
                ? 'text-green-500'
                : 'text-red-500'
              : 'text-white'
          }`}
        />
      </div>
    </div>
  );
}

export default DiceAnimation;