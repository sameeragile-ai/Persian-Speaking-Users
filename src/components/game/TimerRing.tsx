import React from 'react';
import { toPersianDigits } from '../../i18n';

interface Props {
  timeLeft: number; // 0 to 90
  totalTime?: number;
  size?: number;
  strokeWidth?: number;
  currentScore?: number;
}

export const TimerRing: React.FC<Props> = ({
  timeLeft,
  totalTime = 90,
  size = 72,
  strokeWidth = 6,
  currentScore
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, timeLeft / totalTime));
  const strokeDashoffset = circumference - progress * circumference;

  const isLowTime = timeLeft <= 15;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-stone-200 dark:text-stone-700"
          fill="transparent"
        />
        {/* Saffron timer ring that drains */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isLowTime ? '#C8323C' : '#F2A007'}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300"
          fill="transparent"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className={`font-display text-lg leading-none ${
            isLowTime ? 'text-pomegranate animate-pulse' : 'text-stone-900 dark:text-stone-100'
          }`}
        >
          {toPersianDigits(Math.ceil(timeLeft))}
        </span>
        <span className="text-[10px] text-stone-500 font-medium leading-none mt-0.5">ثانیه</span>
      </div>
    </div>
  );
};
