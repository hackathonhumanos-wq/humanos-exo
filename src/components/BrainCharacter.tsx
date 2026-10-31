import React, { useState, useEffect } from 'react';
import { getStageForCount } from '../utils/brainrotHelpers';
import { sounds } from '../utils/audio';

interface BrainCharacterProps {
  count: number;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'floating';
  interactive?: boolean;
  onTap?: () => void;
  overrideStage?: number;
  showDropEffect?: boolean;
}

interface Drop {
  id: number;
  x: number;
  type: 'blue' | 'green';
}

export const BrainCharacter: React.FC<BrainCharacterProps> = ({
  count,
  size = 'md',
  interactive = true,
  onTap,
  overrideStage,
  showDropEffect = true,
}) => {
  const currentStage = overrideStage !== undefined ? overrideStage : getStageForCount(count).stage;
  const isSlimy = currentStage >= 4;
  const isSmoking = currentStage >= 5;

  const [isSquishing, setIsSquishing] = useState(false);
  const [isWobbling, setIsWobbling] = useState(false);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [prevCount, setPrevCount] = useState(count);
  const [prevStage, setPrevStage] = useState(currentStage);

  // Monitor count increases for squish + drip
  useEffect(() => {
    if (count > prevCount) {
      triggerSquish();
      if (showDropEffect) {
        spawnDrop();
      }
    }
    setPrevCount(count);
  }, [count, prevCount, showDropEffect]);

  // Monitor stage changes for shockwave + sound
  useEffect(() => {
    if (currentStage > prevStage) {
      setIsLevelingUp(true);
      sounds.playStageUpgrade();
      const t = setTimeout(() => setIsLevelingUp(false), 900);
      return () => clearTimeout(t);
    }
    setPrevStage(currentStage);
  }, [currentStage, prevStage]);

  const triggerSquish = () => {
    setIsSquishing(true);
    if (isSlimy) {
      sounds.playSlimeBloop();
    } else {
      sounds.playSquish();
    }
    setTimeout(() => setIsSquishing(false), 380);
  };

  const spawnDrop = () => {
    const newDrop: Drop = {
      id: Date.now() + Math.random(),
      x: 35 + Math.random() * 30, // Drop position around center of brain
      type: isSlimy ? 'green' : 'blue',
    };
    setDrops(prev => [...prev.slice(-4), newDrop]);
    setTimeout(() => {
      setDrops(prev => prev.filter(d => d.id !== newDrop.id));
    }, 850);
  };

  const handleClick = () => {
    if (!interactive) return;
    setIsWobbling(true);
    triggerSquish();
    spawnDrop();
    setTimeout(() => setIsWobbling(false), 450);
    onTap?.();
  };

  // Dimensions based on size prop
  const sizeClasses = {
    sm: 'w-12 h-10',
    md: 'w-24 h-20',
    lg: 'w-36 h-30',
    xl: 'w-48 h-40',
    floating: 'w-[92px] h-[78px]',
  }[size];

  const brainSrc = `/assets/brain-${currentStage}.png`;

  return (
    <div
      onClick={handleClick}
      className={`relative select-none flex items-center justify-center ${interactive ? 'cursor-pointer' : ''}`}
      style={{ filter: `drop-shadow(0 8px 24px ${getStageForCount(count).glow})` }}
    >
      {/* Shockwave ring on stage transition */}
      {isLevelingUp && (
        <div className="absolute inset-0 m-auto w-24 h-24 rounded-full border-2 border-[#b8ff3c] animate-shockwave pointer-events-none" />
      )}

      {/* Smoke curls for Stage 5 & 6 */}
      {isSmoking && (
        <div className="absolute -top-6 inset-x-0 flex justify-center pointer-events-none overflow-visible">
          <img
            src="/assets/fx-smoke-1.png"
            alt=""
            className="w-10 h-10 opacity-70 animate-smoke -ml-4"
            style={{ animationDuration: '2.4s', animationDelay: '0s' }}
          />
          <img
            src="/assets/fx-smoke-2.png"
            alt=""
            className="w-12 h-12 opacity-60 animate-smoke ml-2"
            style={{ animationDuration: '2.8s', animationDelay: '0.9s' }}
          />
        </div>
      )}

      {/* Main Brain Sprite with breathing + squish / shake animations */}
      <div
        className={`relative transition-transform duration-150 ${
          isSquishing ? 'animate-squish' : isWobbling ? 'animate-shake' : 'animate-breathe'
        }`}
      >
        <img
          src={brainSrc}
          alt={`Brain Stage ${currentStage}`}
          className={`${sizeClasses} object-contain transition-all duration-300 drop-shadow-md`}
          draggable={false}
        />

        {/* Lightning bolt flash on stage 6 */}
        {currentStage === 6 && (
          <img
            src="/assets/fx-bolt.png"
            alt=""
            className="absolute -top-3 -right-2 w-7 h-7 object-contain opacity-80 animate-pulse pointer-events-none"
          />
        )}
      </div>

      {/* Falling Sweat / Slime Drops */}
      {drops.map(d => (
        <div
          key={d.id}
          className="absolute bottom-1 pointer-events-none animate-drop z-20"
          style={{ left: `${d.x}%` }}
        >
          <img
            src={d.type === 'green' ? '/assets/fx-drop-green.png' : '/assets/fx-drop-blue.png'}
            alt=""
            className="w-3.5 h-3.5 object-contain"
          />
        </div>
      ))}
    </div>
  );
};
