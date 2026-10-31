import React, { useState, useRef, useEffect } from 'react';
import { SAMPLE_REELS, getStageForCount } from '../utils/brainrotHelpers';
import { BrainCharacter } from './BrainCharacter';
import { Heart, MessageCircle, Share2, Music2, ArrowUp, ArrowDown, Move, Smartphone } from 'lucide-react';

interface FloatingOverlaySimulatorProps {
  currentCount: number;
  onIncrementReel: () => void;
  onClose?: () => void;
}

export const FloatingOverlaySimulator: React.FC<FloatingOverlaySimulatorProps> = ({
  currentCount,
  onIncrementReel,
}) => {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showBrain, setShowBrain] = useState(true);

  // Dragging state for the floating brain overlay
  // Start positioned near top-right edge (like the real Android overlay)
  const [pos, setPos] = useState({ x: 230, y: 110 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const activeReel = SAMPLE_REELS[currentReelIndex % SAMPLE_REELS.length];
  const stage = getStageForCount(currentCount);

  // Handle Reel Swipe Up (next reel)
  const handleNextReel = () => {
    setCurrentReelIndex(prev => prev + 1);
    setIsLiked(false);
    onIncrementReel();
  };

  // Handle Reel Swipe Down (prev reel)
  const handlePrevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(prev => prev - 1);
      setIsLiked(false);
      // Swiping back doesn't count again (IndexStrategy policy!)
    }
  };

  // Drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: pos.x,
      startY: pos.y,
    };
  };

  // Drag move & snap to edge on release
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const dx = e.clientX - dragStartRef.current.mouseX;
      const dy = e.clientY - dragStartRef.current.mouseY;

      const containerWidth = 340;
      const containerHeight = 620;
      const brainWidth = 90;
      const brainHeight = 100;

      const newX = Math.max(10, Math.min(containerWidth - brainWidth - 10, dragStartRef.current.startX + dx));
      const newY = Math.max(50, Math.min(containerHeight - brainHeight - 50, dragStartRef.current.startY + dy));

      setPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);

      // Snap to nearest edge (Left vs Right)
      const containerWidth = 340;
      const brainWidth = 90;
      const snapToRight = pos.x > containerWidth / 2 - brainWidth / 2;
      setPos(prev => ({
        ...prev,
        x: snapToRight ? containerWidth - brainWidth - 14 : 14,
      }));
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, pos.x]);

  return (
    <div className="flex flex-col xl:flex-row items-center justify-center gap-8 py-4">
      {/* Phone Screen Mockup */}
      <div
        ref={containerRef}
        className="relative w-[340px] h-[640px] bg-black rounded-[44px] p-3 shadow-2xl border-[6px] border-zinc-800 overflow-hidden select-none"
      >
        {/* Dynamic Island / Camera cutout */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-50 flex items-center justify-end px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700/60" />
        </div>

        {/* Screen Frame */}
        <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-zinc-950 flex flex-col justify-between">
          {/* Simulated Instagram Reels Background / Video Mockup */}
          <div
            className={`absolute inset-0 bg-gradient-to-b ${activeReel.bgGradient} transition-all duration-500 flex flex-col items-center justify-center`}
          >
            {/* Visual simulation pattern */}
            <div className="w-48 h-48 rounded-full border-2 border-white/10 flex items-center justify-center animate-pulse">
              <div className="text-center px-4">
                <span className="text-xs uppercase font-mono tracking-wider text-white/50 block">Simulated Reel</span>
                <span className="text-sm font-bold text-white mt-1 block">{activeReel.videoTopic}</span>
              </div>
            </div>

            {/* Subtle swipe instruction */}
            <div className="absolute top-16 inset-x-0 text-center pointer-events-none">
              <span className="text-[11px] font-mono bg-black/50 text-white/70 px-3 py-1 rounded-full backdrop-blur-sm">
                Swipe up or click arrow for next reel
              </span>
            </div>
          </div>

          {/* Instagram Header Overlay */}
          <div className="relative z-20 pt-8 px-4 flex items-center justify-between text-white drop-shadow-md">
            <span className="font-extrabold text-lg tracking-tight">Reels</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-white/80 bg-black/30 px-2 py-0.5 rounded-full">
                Audio: Trending
              </span>
            </div>
          </div>

          {/* Reel Content Overlay (Bottom left) */}
          <div className="relative z-20 p-4 space-y-2 text-white text-left drop-shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[1.5px]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold">
                  {activeReel.creator.charAt(0)}
                </div>
              </div>
              <div>
                <span className="text-xs font-bold leading-none block">{activeReel.creatorHandle}</span>
                <span className="text-[10px] text-white/70">{activeReel.creator}</span>
              </div>
              <button className="text-[11px] font-semibold border border-white/50 px-2 py-0.5 rounded-full ml-1 hover:bg-white/10">
                Follow
              </button>
            </div>

            <p className="text-xs line-clamp-2 text-white/90 leading-snug">{activeReel.caption}</p>

            <div className="flex items-center gap-1.5 text-[11px] text-white/80">
              <Music2 className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="truncate max-w-[200px]">{activeReel.audioTrack}</span>
            </div>
          </div>

          {/* Instagram Action Buttons (Bottom right) */}
          <div className="absolute right-3 bottom-14 z-20 flex flex-col items-center gap-4 text-white drop-shadow-md">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-125"
            >
              <Heart className={`w-7 h-7 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              <span className="text-[10px] font-semibold">{isLiked ? 'Liked' : activeReel.likes}</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <MessageCircle className="w-7 h-7 text-white" />
              <span className="text-[10px] font-semibold">{activeReel.comments}</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <Share2 className="w-6 h-6 text-white" />
              <span className="text-[10px] font-semibold">Share</span>
            </button>
          </div>

          {/* ----------------- DRAGGABLE FLOATING BRAIN OVERLAY ----------------- */}
          {showBrain && (
            <div
              onMouseDown={handleMouseDown}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                touchAction: 'none',
              }}
              className={`absolute z-40 cursor-grab active:cursor-grabbing transition-shadow ${
                isDragging ? 'shadow-2xl scale-105' : 'transition-[left] duration-300'
              }`}
            >
              {/* Overlay container (92 x 104 dp equivalent) */}
              <div className="relative w-[88px] h-[98px] flex flex-col items-center justify-center p-1 group">
                {/* Drag handle hint indicator */}
                <div className="absolute -top-1 opacity-0 group-hover:opacity-80 transition-opacity bg-black/60 rounded-full px-1 py-0.5">
                  <Move className="w-3 h-3 text-white" />
                </div>

                {/* Floating Brain Sprite with squish and physics */}
                <BrainCharacter count={currentCount} size="floating" interactive={true} />

                {/* Counter Pill attached under the brain */}
                <div className="absolute -bottom-1 bg-[#120f18]/90 border border-white/20 text-white font-mono-numbers font-bold text-xs px-2.5 py-0.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1">
                  <span>{currentCount}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controller & Instruction Panel */}
      <div className="max-w-md space-y-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#b8ff3c] uppercase tracking-wider mb-1">
            <Smartphone className="w-4 h-4" />
            Floating Accessibility Overlay
          </div>
          <h3 className="text-2xl font-extrabold text-white">How the Floating Brain Works</h3>
          <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
            While Instagram Reels is open, Brainrot displays this draggable floating counter directly on top.
            It never blocks taps, tracks scrolling via Android Accessibility events, and visibly rots with each swipe.
          </p>
        </div>

        {/* Swipe Controls */}
        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-5 space-y-4">
          <div className="text-xs font-mono uppercase text-zinc-400">Simulation Controls</div>
          <div className="flex gap-3">
            <button
              onClick={handleNextReel}
              className="flex-1 py-3 px-4 bg-[#f4533f] hover:bg-[#ff6957] active:scale-95 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-[#f4533f]/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowUp className="w-4 h-4" />
              Swipe Next Reel (+1)
            </button>
            <button
              onClick={handlePrevReel}
              disabled={currentReelIndex === 0}
              className="py-3 px-4 bg-[#242423] hover:bg-[#2d2d2c] disabled:opacity-40 text-white font-medium rounded-xl text-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowDown className="w-4 h-4" />
              Prev
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-zinc-400">
            <span>Overlay Visibility</span>
            <button
              onClick={() => setShowBrain(!showBrain)}
              className="text-[#b8ff3c] hover:underline font-mono cursor-pointer"
            >
              {showBrain ? 'Hide Brain Overlay' : 'Show Brain Overlay'}
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-2.5 text-xs text-zinc-300">
          <div className="flex items-start gap-2.5 bg-[#120f18] p-3 rounded-xl border border-white/5">
            <span className="text-[#b8ff3c] font-bold">✓</span>
            <div>
              <strong className="text-white">Edge-Snapping Physics:</strong> Drag the brain anywhere in the phone;
              on release it snaps to the nearest edge and remembers its position.
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-[#120f18] p-3 rounded-xl border border-white/5">
            <span className="text-[#b8ff3c] font-bold">✓</span>
            <div>
              <strong className="text-white">Zero Touch Interference:</strong> The overlay footprint is strictly 92 × 104 dp.
              All touches outside the brain pass straight through to Instagram.
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-[#120f18] p-3 rounded-xl border border-white/5">
            <span className="text-[#b8ff3c] font-bold">✓</span>
            <div>
              <strong className="text-white">Stage-Driven Fluid Drips:</strong> Blue sweat drops drip from stages 0–3,
              switching to thick radioactive green slime at stage 4+ with curls of smoke.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
