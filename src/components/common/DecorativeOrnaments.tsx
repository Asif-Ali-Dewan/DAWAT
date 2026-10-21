import React from 'react';

interface OrnamentProps {
  color?: string;
  className?: string;
}

export const GoldDivider: React.FC<OrnamentProps> = ({ color = '#C59B27', className = 'my-6' }) => (
  <div className={`flex items-center justify-center space-x-3 opacity-80 ${className}`}>
    <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-current" style={{ color }} />
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        fill={color}
        opacity="0.9"
      />
    </svg>
    <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-current" style={{ color }} />
  </div>
);

export const CornerFlourish: React.FC<{ position: 'tl' | 'tr' | 'bl' | 'br'; color?: string }> = ({
  position,
  color = '#C59B27',
}) => {
  const getTransform = () => {
    switch (position) {
      case 'tr':
        return 'rotate(90deg)';
      case 'br':
        return 'rotate(180deg)';
      case 'bl':
        return 'rotate(270deg)';
      default:
        return 'none';
    }
  };

  const getPositionClass = () => {
    switch (position) {
      case 'tr':
        return 'top-2 right-2';
      case 'br':
        return 'bottom-2 right-2';
      case 'bl':
        return 'bottom-2 left-2';
      default:
        return 'top-2 left-2';
    }
  };

  return (
    <div
      className={`absolute ${getPositionClass()} pointer-events-none opacity-60 transition-opacity duration-300`}
      style={{ transform: getTransform() }}
    >
      <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
        <path
          d="M4 4C18 4 28 14 28 28V44M4 4V44M4 4H44"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="3" fill={color} opacity="0.8" />
        <path d="M4 20C12 20 20 12 20 4" stroke={color} strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export const BotanicalCrest: React.FC<OrnamentProps> = ({ color = '#C59B27', className = '' }) => (
  <div className={`flex justify-center ${className}`}>
    <svg width="60" height="40" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M40 38C40 38 32 28 20 28C10 28 4 34 4 34C4 34 10 20 24 20C34 20 40 28 40 28C40 28 46 20 56 20C70 20 76 34 76 34C76 34 70 28 60 28C48 28 40 38 40 38Z"
        fill={color}
        fillOpacity="0.25"
      />
      <circle cx="40" cy="14" r="5" fill={color} fillOpacity="0.9" />
      <path
        d="M40 8L42 13H48L43 16L45 21L40 18L35 21L37 16L32 13H38L40 8Z"
        fill="#FFFFFF"
        opacity="0.9"
      />
      <path
        d="M24 16C18 12 12 14 12 14C12 14 14 20 20 22M56 16C62 12 68 14 68 14C68 14 66 20 60 22"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export const WeddingRingsOrnament: React.FC<OrnamentProps> = ({ color = '#C59B27', className = '' }) => (
  <div className={`flex justify-center ${className}`}>
    <svg width="48" height="32" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="20" r="14" stroke={color} strokeWidth="2.5" opacity="0.85" />
      <circle cx="36" cy="20" r="14" stroke={color} strokeWidth="2.5" opacity="0.85" />
      <path
        d="M36 6L38 10L42 8L40 12L44 14L40 16L42 20L38 18L36 22L34 18L30 20L32 16L28 14L32 12L30 8L34 10L36 6Z"
        fill={color}
        opacity="0.3"
      />
      <circle cx="36" cy="6" r="3" fill={color} />
    </svg>
  </div>
);

export const MonogramBadge: React.FC<{
  brideInitial: string;
  groomInitial: string;
  color?: string;
  className?: string;
}> = ({ brideInitial, groomInitial, color = '#C59B27', className = '' }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <div
      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-105 duration-300"
      style={{ borderColor: color, backgroundColor: 'rgba(255,255,255,0.08)' }}
    >
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-dashed flex items-center justify-center font-heading text-lg sm:text-xl font-bold tracking-widest"
        style={{ borderColor: color, color }}
      >
        <span>{brideInitial}</span>
        <span className="text-xs mx-0.5 opacity-70 font-script">&</span>
        <span>{groomInitial}</span>
      </div>
    </div>
  </div>
);
