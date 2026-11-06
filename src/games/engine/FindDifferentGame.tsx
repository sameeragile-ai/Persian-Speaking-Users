import React, { useState } from 'react';
import { ChallengePayload } from '../../types';
import { RenderIcon } from '../icons';
import { sounds } from '../../lib/audio';

interface Props {
  payload: ChallengePayload;
  correctAnswer: number;
  onAnswer: (answer: number) => void;
  disabled: boolean;
  reduceMotion?: boolean;
}

export const FindDifferentGame: React.FC<Props> = ({
  payload,
  correctAnswer,
  onAnswer,
  disabled,
  reduceMotion
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const items = payload.items || [];
  const gridCols = payload.gridCols || (items.length > 4 ? 3 : 2);

  const handleSelect = (idx: number) => {
    if (disabled || selectedIdx !== null) return;
    setSelectedIdx(idx);
    sounds.playTap();
    sounds.vibrate(12);
    onAnswer(idx);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2">
      <div
        className={`grid gap-3 w-full max-w-[340px] place-items-center ${
          gridCols === 3 ? 'grid-cols-3' : 'grid-cols-2'
        }`}
      >
        {items.map((item, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrectTarget = idx === correctAnswer;
          let borderClasses =
            'border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800';

          if (selectedIdx !== null) {
            if (isSelected) {
              borderClasses = isCorrectTarget
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-4 ring-emerald-500/20'
                : 'border-pomegranate bg-rose-50 dark:bg-rose-950/40 animate-shake';
            } else if (isCorrectTarget) {
              borderClasses = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/20';
            }
          }

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(idx)}
              disabled={disabled || selectedIdx !== null}
              type="button"
              className={`min-w-[72px] min-h-[72px] w-full aspect-square rounded-2xl flex items-center justify-center transition-all ${
                !reduceMotion ? 'active:scale-95 duration-150' : ''
              } shadow-sm hover:shadow-md cursor-pointer ${borderClasses}`}
              aria-label={`گزینه ${idx + 1}`}
            >
              <RenderIcon
                name={item.nameKey}
                size={items.length === 9 ? 44 : 54}
                color={item.color}
                rotation={item.rotation}
                variation={item.variation}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
