import React from 'react';

interface OrnamentProps {
  color?: string;
  className?: string;
}

export const GoldDivider: React.FC<OrnamentProps> = ({ color = '#D4AF37', className = 'my-5' }) => (
  <div className={`flex items-center justify-center space-x-3 opacity-90 ${className}`}>
    <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-current" style={{ color }} />
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        fill={color}
      />
    </svg>
    <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-current" style={{ color }} />
  </div>
);

export const TraditionalCornerFlourish: React.FC<{ position: 'tl' | 'tr' | 'bl' | 'br'; color?: string }> = ({
  position,
  color = '#D4AF37',
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
      className={`absolute ${getPositionClass()} pointer-events-none opacity-85 transition-opacity duration-300`}
      style={{ transform: getTransform() }}
    >
      <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
        <path
          d="M3 3H24C24 14.598 14.598 24 3 24V3Z"
          stroke={color}
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M3 3V42M3 3H42"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="8" cy="8" r="2.5" fill={color} />
        <path d="M12 4C18 10 20 18 20 28" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      </svg>
    </div>
  );
};

export const DesiWeddingArch: React.FC<OrnamentProps> = ({ color = '#D4AF37', className = '' }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <svg width="70" height="45" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Traditional Mehrab Arch */}
      <path
        d="M40 4C30 4 20 12 14 26C10 34 10 46 10 46H70C70 46 70 34 66 26C60 12 50 4 40 4Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.85"
      />
      <circle cx="40" cy="18" r="4" fill={color} />
      <path
        d="M40 6V14M35 22L40 18L45 22"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Paisley finial */}
      <path
        d="M26 36C26 36 32 30 40 30C48 30 54 36 54 36"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.7"
      />
    </svg>
  </div>
);

export const CorporateSealBadge: React.FC<OrnamentProps> = ({ color = '#C5A059', className = '' }) => (
  <div className={`flex justify-center ${className}`}>
    <div
      className="w-14 h-14 rounded-full border border-dashed flex items-center justify-center"
      style={{ borderColor: color }}
    >
      <div
        className="w-11 h-11 rounded-full border flex items-center justify-center text-[10px] font-bold tracking-widest uppercase font-mono"
        style={{ borderColor: color, color }}
      >
        OFFICIAL
      </div>
    </div>
  </div>
);

export const MonogramBadge: React.FC<{
  brideInitial: string;
  groomInitial: string;
  color?: string;
  className?: string;
}> = ({ brideInitial, groomInitial, color = '#D4AF37', className = '' }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <div
      className="w-16 h-16 rounded-full border-2 flex items-center justify-center backdrop-blur-sm"
      style={{ borderColor: color, backgroundColor: 'rgba(0,0,0,0.2)' }}
    >
      <div
        className="w-13 h-13 rounded-full border border-dashed flex items-center justify-center font-heading text-lg font-bold tracking-widest"
        style={{ borderColor: color, color }}
      >
        <span>{brideInitial}</span>
        <span className="text-xs mx-0.5 opacity-80 font-script">&</span>
        <span>{groomInitial}</span>
      </div>
    </div>
  </div>
);
