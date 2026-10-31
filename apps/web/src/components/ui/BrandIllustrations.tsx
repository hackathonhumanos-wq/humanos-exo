/**
 * @file apps/web/src/components/ui/BrandIllustrations.tsx
 * @description Custom SVG brand emblems, friendly AI Coach mascot, achievement trophies, and resilient student avatars
 */
import React, { useState } from 'react';

interface FocusFlowLogoProps {
  showTagline?: boolean;
  compact?: boolean;
}

export const FocusFlowLogo: React.FC<FocusFlowLogoProps> = ({
  showTagline = true,
  compact = false,
}) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#E5FBF1] to-[#CEF5E3] border border-[#CBEFE0] flex items-center justify-center shrink-0 shadow-2xs">
        <svg
          viewBox="0 0 40 40"
          className="w-8 h-8"
          fill="none"
          aria-hidden="true"
        >
          {/* Person head / sun sprout */}
          <circle cx="20" cy="11" r="4.3" fill="#52D69C" />
          {/* Left leaf */}
          <path
            d="M19.1 33.2C10.8 31.8 6.2 25.4 6.6 17.8C13.6 18.1 18.3 22.8 19.1 33.2Z"
            fill="#079669"
          />
          {/* Right leaf */}
          <path
            d="M20.9 33.2C29.2 31.8 33.8 25.4 33.4 17.8C26.4 18.1 21.7 22.8 20.9 33.2Z"
            fill="#15B882"
          />
          {/* Center person-sprout stem */}
          <path
            d="M20 33.5V17.2"
            stroke="#067652"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="font-display font-extrabold text-[19px] tracking-tight text-[#142447]">
            FOCUS<span className="text-[#079669]">FLOW</span>
          </div>
          {showTagline && (
            <div className="text-[11px] font-medium text-[#52627D] tracking-tight">
              Focus • Study • Grow
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const CurvedCountUnderline: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 180 14"
    fill="none"
    className={`w-full h-3.5 ${className}`}
    aria-hidden="true"
    preserveAspectRatio="none"
  >
    <path
      d="M3 10.5C46 3.2 124 2.4 177 10.5"
      stroke="#079669"
      strokeWidth="3.8"
      strokeLinecap="round"
    />
  </svg>
);

export const AICoachMascot: React.FC<{ variant?: 'hero' | 'avatar'; className?: string }> = ({
  variant = 'hero',
  className = '',
}) => {
  if (variant === 'avatar') {
    return (
      <div
        className={`w-16 h-16 rounded-full bg-gradient-to-b from-[#E6F4FE] to-[#DDF7EC] border border-[#CFEAE0] flex items-center justify-center shrink-0 overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 72 72" className="w-14 h-14" fill="none">
          {/* Antenna */}
          <line x1="36" y1="8" x2="36" y2="15" stroke="#5B8DEF" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="36" cy="7" r="3" fill="#2878F0" />
          {/* Ears */}
          <rect x="11" y="29" width="6" height="14" rx="3" fill="#8AB7F9" />
          <rect x="55" y="29" width="6" height="14" rx="3" fill="#8AB7F9" />
          {/* Head */}
          <rect x="15" y="16" width="42" height="34" rx="17" fill="#FFFFFF" stroke="#DCE8F8" strokeWidth="2" />
          {/* Visor */}
          <rect x="20" y="22" width="32" height="21" rx="10.5" fill="#142447" />
          {/* Happy eyes */}
          <path d="M26 31.5C27.2 29.3 29.8 29.3 31 31.5" stroke="#5CE1E6" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M41 31.5C42.2 29.3 44.8 29.3 46 31.5" stroke="#5CE1E6" strokeWidth="2.5" strokeLinecap="round" />
          {/* Smile */}
          <path d="M32.5 36.5C34.2 38.5 37.8 38.5 39.5 36.5" stroke="#5CE1E6" strokeWidth="2.2" strokeLinecap="round" />
          {/* Torso */}
          <path d="M23 52C23 48.5 26 47 36 47C46 47 49 48.5 49 52V66H23V52Z" fill="#FFFFFF" stroke="#DCE8F8" strokeWidth="2" />
          <circle cx="36" cy="56" r="3.5" fill="#DDF7EC" stroke="#079669" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 176 146"
      fill="none"
      className={`w-36 sm:w-40 h-auto shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      {/* Subtle mint backdrop circle */}
      <circle cx="108" cy="78" r="56" fill="#CBEFE0" fillOpacity="0.65" />
      {/* Sparkle rays */}
      <path d="M56 32L61 37M52 43L59 44" stroke="#079669" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M30 108L40 112M35 103L35 117M31 115L39 105" stroke="#079669" strokeWidth="2" strokeLinecap="round" />

      {/* Waving left arm */}
      <path
        d="M68 84C58 75 56 62 63 55C67 51 73 55 73 62L76 78"
        fill="#FFFFFF"
        stroke="#C9DCF4"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Antenna */}
      <line x1="114" y1="14" x2="114" y2="25" stroke="#5B8DEF" strokeWidth="3" strokeLinecap="round" />
      <circle cx="114" cy="12" r="4.5" fill="#2878F0" />

      {/* Side headphones */}
      <rect x="74" y="47" width="8" height="20" rx="4" fill="#7BAEF7" />
      <rect x="146" y="47" width="8" height="20" rx="4" fill="#7BAEF7" />

      {/* Robot head */}
      <rect x="80" y="25" width="68" height="54" rx="26" fill="#FFFFFF" stroke="#D5E4F7" strokeWidth="2.5" />
      {/* Dark navy visor */}
      <rect x="89" y="35" width="50" height="33" rx="16" fill="#142447" />
      {/* Glowing friendly eyes */}
      <path d="M99 49C101 45.5 105.5 45.5 107.5 49" stroke="#5CE1E6" strokeWidth="3" strokeLinecap="round" />
      <path d="M120.5 49C122.5 45.5 127 45.5 129 49" stroke="#5CE1E6" strokeWidth="3" strokeLinecap="round" />
      {/* Friendly smile */}
      <path d="M109 57C111.8 60.2 116.2 60.2 119 57" stroke="#5CE1E6" strokeWidth="2.6" strokeLinecap="round" />
      {/* Soft cheek glow */}
      <circle cx="96" cy="55" r="2.5" fill="#4AD295" fillOpacity="0.65" />
      <circle cx="132" cy="55" r="2.5" fill="#4AD295" fillOpacity="0.65" />

      {/* Robot body */}
      <rect x="88" y="81" width="52" height="44" rx="18" fill="#FFFFFF" stroke="#D5E4F7" strokeWidth="2.5" />
      {/* Leaf emblem on chest */}
      <path d="M114 99C109 98 106 94 106.5 89.5C110.5 90 113.5 93 114 99Z" fill="#079669" />
      <path d="M114 99C119 98 122 94 121.5 89.5C117.5 90 114.5 93 114 99Z" fill="#18C28C" />

      {/* Laptop in foreground */}
      <path d="M48 93H97L104 125H55L48 93Z" fill="#8DA4C4" stroke="#738CB0" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="76" cy="109" r="3.5" fill="#EBF3FC" />
      <rect x="53" y="124" width="66" height="5" rx="2.5" fill="#6D86AB" />
    </svg>
  );
};

export const TrophyBadgeIllustration: React.FC<{
  kind: 'focus_master' | 'study_champion' | 'productivity_star' | 'streak_flame';
  className?: string;
}> = ({ kind, className = 'w-14 h-14' }) => {
  if (kind === 'streak_flame') {
    return (
      <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
        <path
          d="M34 6C35 16 48 21 48 36C48 47.6 39.5 56 29.5 56C19.5 56 13 48.2 13 38.5C13 29.5 19.5 23 23 18.5C22.5 23.5 25.5 26 27.5 26C26.5 18.5 29.5 11 34 6Z"
          fill="url(#flameOuter)"
        />
        <path
          d="M31 25C32 31 39 34 39 42C39 48.2 34.6 52.5 29.5 52.5C24.4 52.5 21 48.4 21 43C21 37.5 26.5 32.5 31 25Z"
          fill="#FFE066"
        />
        <defs>
          <linearGradient id="flameOuter" x1="30" y1="6" x2="30" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF9F1C" />
            <stop offset="1" stopColor="#F28A35" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (kind === 'focus_master') {
    return (
      <svg viewBox="0 0 68 68" fill="none" className={className} aria-hidden="true">
        <path
          d="M34 5L58 17V47L34 61L10 47V17L34 5Z"
          fill="#FFF4D6"
          stroke="#F5B841"
          strokeWidth="2.5"
        />
        <path
          d="M23 22H45V31C45 37.1 40.1 42 34 42C27.9 42 23 37.1 23 31V22Z"
          fill="#F59E0B"
        />
        <path d="M23 25H18C18 30 20 33 24 33" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M45 25H50C50 30 48 33 44 33" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="31" y="41" width="6" height="7" fill="#D97706" />
        <rect x="25" y="47" width="18" height="4.5" rx="2" fill="#B45309" />
      </svg>
    );
  }

  if (kind === 'study_champion') {
    return (
      <svg viewBox="0 0 68 68" fill="none" className={className} aria-hidden="true">
        <path
          d="M34 5L58 17V47L34 61L10 47V17L34 5Z"
          fill="#EBF4FF"
          stroke="#2878F0"
          strokeWidth="2.5"
        />
        <circle cx="34" cy="34" r="16" fill="#2878F0" />
        <path
          d="M23 40L25 27L30.5 32.5L34 25L37.5 32.5L43 27L45 40H23Z"
          fill="#FBBF24"
          stroke="#FEF3C7"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 68 68" fill="none" className={className} aria-hidden="true">
      <path
        d="M34 5L58 17V47L34 61L10 47V17L34 5Z"
        fill="#FEF3C7"
        stroke="#D97706"
        strokeWidth="2.5"
      />
      <path
        d="M34 12L52 21.5V43.5L34 54L16 43.5V21.5L34 12Z"
        fill="#92400E"
      />
      <path
        d="M34 19L37.9 27.2L46.9 28.4L40.3 34.7L41.9 43.6L34 39.3L26.1 43.6L27.7 34.7L21.1 28.4L30.1 27.2L34 19Z"
        fill="#FBBF24"
        stroke="#FEF3C7"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
};

interface StudentAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  illustratedPortrait?: boolean;
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  name,
  avatarUrl,
  size = 'md',
  isOnline,
  illustratedPortrait = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const sizeClass =
    size === 'sm'
      ? 'w-9 h-9 text-xs'
      : size === 'lg'
        ? 'w-12 h-12 text-base'
        : size === 'xl'
          ? 'w-16 h-16 text-lg'
          : 'w-9 h-9 text-xs';

  return (
    <div className="relative inline-flex shrink-0">
      {avatarUrl && !imgError ? (
        <img
          src={avatarUrl}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className={`${sizeClass} rounded-full object-cover border border-[#CBEFE0] bg-[#DDF7EC]`}
        />
      ) : illustratedPortrait ? (
        <div
          className={`${sizeClass} rounded-full overflow-hidden border border-[#CBEFE0] bg-[#DDF7EC] flex items-center justify-center select-none`}
          role="img"
          aria-label={name}
        >
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            <circle cx="24" cy="24" r="24" fill="#D5F4E6" />
            {/* Shirt / collar */}
            <path d="M9 48C10.5 39.5 16.2 36 24 36C31.8 36 37.5 39.5 39 48H9Z" fill="#1F3A5F" />
            <path d="M19 36L24 41L29 36" fill="#FFFFFF" />
            {/* Neck */}
            <rect x="20.5" y="30" width="7" height="7" rx="3" fill="#E6A57E" />
            {/* Ears */}
            <circle cx="14.5" cy="24.5" r="2.5" fill="#E6A57E" />
            <circle cx="33.5" cy="24.5" r="2.5" fill="#E6A57E" />
            {/* Face */}
            <rect x="15.5" y="13.5" width="17" height="19.5" rx="8.5" fill="#F1B691" />
            {/* Curly / textured student hair */}
            <path
              d="M14.5 21C14 14 18 10 24 10C30 10 34 14 33.5 21C32.2 17.5 29.5 15.8 24 15.8C18.5 15.8 15.8 17.5 14.5 21Z"
              fill="#1E293B"
            />
            <circle cx="19" cy="12.5" r="3.2" fill="#1E293B" />
            <circle cx="24" cy="11.5" r="3.6" fill="#1E293B" />
            <circle cx="29" cy="12.5" r="3.2" fill="#1E293B" />
            {/* Friendly eyes & eyebrows */}
            <path d="M18.8 20.5C19.6 19.9 20.8 19.9 21.6 20.5" stroke="#1E293B" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M26.4 20.5C27.2 19.9 28.4 19.9 29.2 20.5" stroke="#1E293B" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="20.2" cy="22.8" r="1.2" fill="#142447" />
            <circle cx="27.8" cy="22.8" r="1.2" fill="#142447" />
            {/* Warm smile */}
            <path
              d="M21 27.3C22.2 28.8 25.8 28.8 27 27.3"
              stroke="#8C4A32"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ) : (
        <div
          className={`${sizeClass} rounded-full bg-gradient-to-br from-[#DDF7EC] to-[#C6EFE0] border border-[#B3E6D2] text-[#079669] font-bold flex items-center justify-center select-none`}
          aria-label={name}
        >
          {initials || 'FF'}
        </div>
      )}
      {isOnline !== undefined && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
            isOnline ? 'bg-[#079669]' : 'bg-slate-300'
          }`}
          title={isOnline ? 'Online now' : 'Offline'}
        />
      )}
    </div>
  );
};
