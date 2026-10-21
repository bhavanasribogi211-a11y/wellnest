import React from 'react';

interface NestyMascotProps {
  mood?: 'happy' | 'waving' | 'thinking' | 'doctor' | 'cheering';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  bubbleText?: string;
  className?: string;
  animate?: boolean;
}

export const NestyMascot: React.FC<NestyMascotProps> = ({
  mood = 'happy',
  size = 'md',
  bubbleText,
  className = '',
  animate = true,
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Speech bubble if provided */}
      {bubbleText && (
        <div className="mb-2 max-w-xs px-3.5 py-2 text-xs font-semibold rounded-2xl bg-white/95 backdrop-blur-md text-slate-800 shadow-md border border-pink-100/80 relative animate-float">
          <span>{bubbleText}</span>
          <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-pink-100/80" />
        </div>
      )}

      {/* Mascot SVG */}
      <div className={`${sizeMap[size]} ${animate ? 'animate-float' : ''} relative`}>
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-md overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Body Gradient */}
            <linearGradient id="chickBody" x1="60" y1="20" x2="60" y2="105" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE047" />
              <stop offset="0.6" stopColor="#FACC15" />
              <stop offset="1" stopColor="#EAB308" />
            </linearGradient>

            {/* Belly highlight */}
            <radialGradient id="bellyGlow" cx="60" cy="75" r="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEF9C3" stopOpacity="0.9" />
              <stop offset="1" stopColor="#FEF08A" stopOpacity="0" />
            </radialGradient>

            {/* Wing Gradient */}
            <linearGradient id="wingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#FDE047" />
              <stop offset="1" stopColor="#CA8A04" />
            </linearGradient>

            {/* Beak Gradient */}
            <linearGradient id="beakGrad" x1="60" y1="52" x2="60" y2="68" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FB923C" />
              <stop offset="1" stopColor="#EA580C" />
            </linearGradient>

            {/* Stethoscope Gradient */}
            <linearGradient id="stethGrad" x1="30" y1="50" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
          </defs>

          {/* Floating heart decoration */}
          <g className="animate-pulse">
            <path
              d="M98 25 C98 20 92 16 88 20 C84 16 78 20 78 25 C78 32 88 38 88 38 C88 38 98 32 98 25 Z"
              fill="#EC4899"
              opacity="0.85"
            />
          </g>

          {/* Feet */}
          <path d="M46 98 C46 104 42 108 38 108" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
          <path d="M46 98 C46 104 46 108 46 108" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
          <path d="M74 98 C74 104 74 108 74 108" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
          <path d="M74 98 C74 104 78 108 82 108" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />

          {/* Body */}
          <circle cx="60" cy="65" r="40" fill="url(#chickBody)" />
          <ellipse cx="60" cy="74" rx="24" ry="20" fill="url(#bellyGlow)" />

          {/* Tuft / Feather on head */}
          <path
            d="M60 25 C58 14 66 12 65 6 C61 10 56 18 58 25 Z"
            fill="#FACC15"
          />
          <path
            d="M60 25 C64 16 72 15 70 9 C66 12 62 18 60 25 Z"
            fill="#EAB308"
          />

          {/* Doctor Stethoscope if mood === 'doctor' */}
          {mood === 'doctor' && (
            <g>
              <path
                d="M40 58 C38 78 48 92 60 92 C72 92 82 78 80 58"
                stroke="url(#stethGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="60" cy="94" r="5" fill="#E2E8F0" stroke="#0284C7" strokeWidth="2" />
              <circle cx="60" cy="94" r="2.5" fill="#0EA5E9" />
            </g>
          )}

          {/* Left Wing */}
          {mood === 'waving' ? (
            <path
              d="M22 62 C10 45 12 36 24 40 C32 44 32 58 24 64 Z"
              fill="url(#wingGrad)"
              className="origin-bottom-right"
            />
          ) : mood === 'cheering' ? (
            <path
              d="M25 55 C12 40 16 30 28 35 C34 40 32 55 25 55 Z"
              fill="url(#wingGrad)"
            />
          ) : (
            <path
              d="M24 62 C18 66 18 78 26 84 C32 86 35 76 34 68 Z"
              fill="url(#wingGrad)"
            />
          )}

          {/* Right Wing */}
          {mood === 'cheering' ? (
            <path
              d="M95 55 C108 40 104 30 92 35 C86 40 88 55 95 55 Z"
              fill="url(#wingGrad)"
            />
          ) : (
            <path
              d="M96 62 C102 66 102 78 94 84 C88 86 85 76 86 68 Z"
              fill="url(#wingGrad)"
            />
          )}

          {/* Cheeks (Blushing pink) */}
          <ellipse cx="40" cy="66" rx="6" ry="4" fill="#F472B6" opacity="0.6" />
          <ellipse cx="80" cy="66" rx="6" ry="4" fill="#F472B6" opacity="0.6" />

          {/* Eyes */}
          {mood === 'thinking' ? (
            <g>
              <ellipse cx="48" cy="54" rx="4" ry="5" fill="#1E293B" />
              <ellipse cx="72" cy="54" rx="4" ry="5" fill="#1E293B" />
              {/* Eye sparkle looking up */}
              <circle cx="50" cy="52" r="1.8" fill="#FFFFFF" />
              <circle cx="74" cy="52" r="1.8" fill="#FFFFFF" />
            </g>
          ) : (
            <g>
              <ellipse cx="47" cy="56" rx="4.5" ry="5.5" fill="#0F172A" />
              <ellipse cx="73" cy="56" rx="4.5" ry="5.5" fill="#0F172A" />
              {/* Eye catchlights */}
              <circle cx="49" cy="54" r="1.8" fill="#FFFFFF" />
              <circle cx="75" cy="54" r="1.8" fill="#FFFFFF" />
              <circle cx="46" cy="58" r="0.8" fill="#FFFFFF" />
              <circle cx="72" cy="58" r="0.8" fill="#FFFFFF" />
            </g>
          )}

          {/* Beak */}
          <path
            d="M53 62 Q60 56 67 62 Q60 72 53 62 Z"
            fill="url(#beakGrad)"
          />

          {/* Thinking light bulb bubble */}
          {mood === 'thinking' && (
            <g transform="translate(84, 15)">
              <circle cx="8" cy="8" r="8" fill="#FDE047" opacity="0.9" />
              <path d="M8 4 L8 12 M4 8 L12 8" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
