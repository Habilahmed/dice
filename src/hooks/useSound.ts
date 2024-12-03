import { useState, useCallback } from 'react';

const sounds = {
  roll: new Audio('https://cdn.freesound.org/previews/573/573660_1619369-lq.mp3'),
  win: new Audio('https://cdn.freesound.org/previews/456/456966_9498603-lq.mp3'),
  lose: new Audio('https://cdn.freesound.org/previews/522/522720_9498603-lq.mp3'),
  click: new Audio('https://cdn.freesound.org/previews/242/242503_4284968-lq.mp3')
};

Object.values(sounds).forEach(audio => {
  audio.load();
  audio.volume = 0.4;
});

export default function useSound() {
  const [isMuted, setIsMuted] = useState(false);

  const playSound = useCallback((sound: keyof typeof sounds) => {
    if (!isMuted) {
      const audio = sounds[sound];
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return { playSound, toggleMute, isMuted };
}