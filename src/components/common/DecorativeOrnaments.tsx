import React from 'react';

interface OrnamentProps {
  color?: string;
  className?: string;
}

export const GoldDivider: React.FC<OrnamentProps> = ({ color = '#D4AF37', className = 'my-4' }) => (
  <div className={`flex items-center justify-center space-x-3 opacity-90 ${className}`}>
    <div className="h-[1px] w-10 sm:w-16 bg-current" style={{ color }} />
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        fill={color}
      />
    </svg>
    <div className="h-[1px] w-10 sm:w-16 bg-current" style={{ color }} />
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
      className={`absolute ${getPositionClass()} pointer-events-none opacity-75 transition-opacity duration-300`}
      style={{ transform: getTransform() }}
    >
      <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
        <path
          d="M3 3H24C24 14.598 14.598 24 3 24V3Z"
          stroke={color}
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M3 3V36M3 3H36"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="7" cy="7" r="2" fill={color} />
      </svg>
    </div>
  );
};

export const DesiWeddingArch: React.FC<OrnamentProps> = ({ color = '#D4AF37', className = '' }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <svg width="60" height="36" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M40 4C30 4 20 12 14 26C10 34 10 46 10 46H70C70 46 70 34 66 26C60 12 50 4 40 4Z"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        opacity="0.8"
      />
      <circle cx="40" cy="18" r="3" fill={color} />
      <path
        d="M40 6V14M35 22L40 18L45 22"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export const CorporateSealBadge: React.FC<OrnamentProps> = ({ color = '#C5A059', className = '' }) => (
  <div className={`flex justify-center ${className}`}>
    <div
      className="w-12 h-12 rounded-full border border-dashed flex items-center justify-center"
      style={{ borderColor: color }}
    >
      <div
        className="w-9 h-9 rounded-full border flex items-center justify-center text-[9px] font-bold tracking-widest uppercase font-mono"
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
      className="w-12 h-12 rounded-full border flex items-center justify-center backdrop-blur-sm"
      style={{ borderColor: color, backgroundColor: 'rgba(0,0,0,0.2)' }}
    >
      <div
        className="w-9 h-9 rounded-full border border-dashed flex items-center justify-center font-heading text-sm font-bold tracking-wider"
        style={{ borderColor: color, color }}
      >
        <span>{brideInitial}</span>
        <span className="text-[10px] mx-0.5 opacity-80 font-script">&</span>
        <span>{groomInitial}</span>
      </div>
    </div>
  </div>
);

export const BarcodeGraphic: React.FC<{ serial?: string; color?: string; className?: string }> = ({
  serial = 'DAW-2026-8849-01',
  color = '#D4AF37',
  className = '',
}) => {
  const bars = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="flex items-end justify-center h-7 space-x-[2px] opacity-90">
        {bars.map((width, idx) => (
          <div
            key={idx}
            className="h-full rounded-[0.5px]"
            style={{
              width: `${width * 1.3}px`,
              backgroundColor: color,
            }}
          />
        ))}
      </div>
      <span
        className="text-[9px] font-mono tracking-widest uppercase mt-1 opacity-80"
        style={{ color }}
      >
        {serial}
      </span>
    </div>
  );
};

export const AdmitOneStamp: React.FC<{ color?: string; text?: string; className?: string }> = ({
  color = '#D4AF37',
  text = 'ADMIT ONE',
  className = '',
}) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div
      className="px-3 py-1 rounded-full border-2 border-dashed flex items-center justify-center text-[10px] font-mono font-bold tracking-widest uppercase"
      style={{ borderColor: color, color }}
    >
      {text}
    </div>
  </div>
);
