import React from 'react';

interface PlaceValueBlocksProps {
  hundreds: number;
  tens: number;
  ones: number;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const HundredBlock: React.FC<{ size: string }> = ({ size }) => {
  const sizeClass = size === 'sm' ? 'w-12 h-12' : size === 'md' ? 'w-16 h-16' : 'w-20 h-20';
  return (
    <div className={`${sizeClass} rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-purple-700 shadow-lg relative overflow-hidden`}>
      <div className="grid grid-cols-5 grid-rows-5 gap-px p-0.5 h-full w-full">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="bg-purple-300 rounded-sm opacity-60" />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold text-white drop-shadow ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>۱۰۰</span>
      </div>
    </div>
  );
};

export const TenBlock: React.FC<{ size: string }> = ({ size }) => {
  const w = size === 'sm' ? 'w-4' : size === 'md' ? 'w-5' : 'w-6';
  const h = size === 'sm' ? 'h-12' : size === 'md' ? 'h-16' : 'h-20';
  return (
    <div className={`${w} ${h} rounded bg-gradient-to-b from-blue-400 to-blue-600 border-2 border-blue-700 shadow-md flex flex-col gap-px p-0.5`}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex-1 bg-blue-300 rounded-sm opacity-60" />
      ))}
    </div>
  );
};

export const OneBlock: React.FC<{ size: string }> = ({ size }) => {
  const sizeClass = size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8';
  return (
    <div className={`${sizeClass} rounded bg-gradient-to-br from-yellow-400 to-amber-500 border-2 border-amber-600 shadow`} />
  );
};

// Static visual representations for identification questions
export const HundredBlockDemo: React.FC = () => (
  <div className="flex flex-col items-center gap-1 p-3 bg-purple-50 rounded-xl border-2 border-purple-200">
    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-purple-700 shadow-lg relative overflow-hidden">
      <div className="grid grid-cols-5 grid-rows-5 gap-px p-0.5 h-full w-full">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="bg-purple-300 rounded-sm opacity-60" />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold text-white drop-shadow text-sm">۱۰۰</span>
      </div>
    </div>
    <span className="text-xs font-bold text-purple-700">بلوک صدتایی 🟣</span>
  </div>
);

export const TenBlockDemo: React.FC = () => (
  <div className="flex flex-col items-center gap-1 p-3 bg-blue-50 rounded-xl border-2 border-blue-200">
    <div className="w-5 h-16 rounded bg-gradient-to-b from-blue-400 to-blue-600 border-2 border-blue-700 shadow-md flex flex-col gap-px p-0.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex-1 bg-blue-300 rounded-sm opacity-60" />
      ))}
    </div>
    <span className="text-xs font-bold text-blue-700">میله ده‌تایی 🔵</span>
  </div>
);

export const OneBlockDemo: React.FC = () => (
  <div className="flex flex-col items-center gap-1 p-3 bg-amber-50 rounded-xl border-2 border-amber-200">
    <div className="w-8 h-8 rounded bg-gradient-to-br from-yellow-400 to-amber-500 border-2 border-amber-600 shadow" />
    <span className="text-xs font-bold text-amber-700">مکعب یکی 🟡</span>
  </div>
);

export const PlaceValueBlocks: React.FC<PlaceValueBlocksProps> = ({
  hundreds,
  tens,
  ones,
  showLabels = true,
  size = 'md',
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap gap-6 items-end justify-center">
        {/* Hundreds */}
        {hundreds > 0 && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-wrap gap-2 justify-center max-w-[200px]">
              {Array.from({ length: hundreds }).map((_, i) => (
                <HundredBlock key={`h-${i}`} size={size} />
              ))}
            </div>
            {showLabels && (
              <span className="text-sm font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                🟣 {hundreds} صدتایی
              </span>
            )}
          </div>
        )}

        {/* Tens */}
        {tens > 0 && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1 justify-center">
              {Array.from({ length: tens }).map((_, i) => (
                <TenBlock key={`t-${i}`} size={size} />
              ))}
            </div>
            {showLabels && (
              <span className="text-sm font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                🔵 {tens} ده‌تایی
              </span>
            )}
          </div>
        )}

        {/* Ones */}
        {ones > 0 && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-wrap gap-1 justify-center max-w-[80px]">
              {Array.from({ length: ones }).map((_, i) => (
                <OneBlock key={`o-${i}`} size={size} />
              ))}
            </div>
            {showLabels && (
              <span className="text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                🟡 {ones} یکی
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceValueBlocks;
