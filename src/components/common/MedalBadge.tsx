import React from 'react';
import { toPersianDigits } from '../../i18n';

interface Props {
  rank: number;
  size?: 'sm' | 'md' | 'lg';
}

export const MedalBadge: React.FC<Props> = ({ rank, size = 'md' }) => {
  if (rank > 3) {
    return (
      <span className="font-display text-stone-500 font-bold px-2 text-sm">
        {toPersianDigits(rank)}
      </span>
    );
  }

  const dimensions =
    size === 'sm'
      ? { box: 'w-6 h-6', text: 'text-xs' }
      : size === 'lg'
      ? { box: 'w-10 h-10', text: 'text-base' }
      : { box: 'w-7 h-7', text: 'text-sm' };

  // Rank 1: Gold / Saffron Persian 8-point tile
  // Rank 2: Silver Turquoise tile
  // Rank 3: Bronze Terracotta tile
  let bgGradient = 'from-amber-400 via-amber-300 to-yellow-600 text-amber-950 border-amber-300';
  let shadow = 'shadow-amber-500/30';

  if (rank === 2) {
    bgGradient = 'from-slate-200 via-teal-100 to-slate-400 text-slate-800 border-teal-200';
    shadow = 'shadow-teal-500/20';
  } else if (rank === 3) {
    bgGradient = 'from-amber-600 via-orange-400 to-amber-800 text-white border-amber-700';
    shadow = 'shadow-orange-500/20';
  }

  return (
    <div
      className={`relative ${dimensions.box} rounded-lg bg-gradient-to-br ${bgGradient} border flex items-center justify-center font-display ${dimensions.text} font-black shadow-xs ${shadow} transform rotate-45 select-none`}
    >
      <span className="-rotate-45 leading-none">{toPersianDigits(rank)}</span>
    </div>
  );
};
