import React, { useState } from 'react';
import { ChallengePayload } from '../../types';
import { RenderIcon } from '../icons';
import { sounds } from '../../lib/audio';

interface Props {
  payload: ChallengePayload;
  correctAnswer: number[]; // indices of the two matching items
  onAnswer: (answer: number[]) => void;
  disabled: boolean;
  reduceMotion?: boolean;
}

export const MatchPairGame: React.FC<Props> = ({
  payload,
  correctAnswer,
  onAnswer,
  disabled,
  reduceMotion
}) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const items = payload.items || [];
  const gridCols = items.length === 8 ? 4 : 3;

  const handleTap = (idx: number) => {
    if (disabled || selectedIndices.length >= 2) return;

    sounds.playTap();
    sounds.vibrate(10);

    if (selectedIndices.includes(idx)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== idx));
      return;
    }

    const nextSelected = [...selectedIndices, idx];
    setSelectedIndices(nextSelected);

    if (nextSelected.length === 2) {
      onAnswer(nextSelected);
    }
  };

  const isPairMatch =
    selectedIndices.length === 2 &&
    correctAnswer.includes(selectedIndices[0]) &&
    correctAnswer.includes(selectedIndices[1]);

  return (
    <div className="w-full flex flex-col items-center justify-center p-2">
      <div className="w-full max-w-[340px] flex flex-col items-center gap-3">
        {/* Selection prompt status */}
        <div className="text-xs font-medium text-stone-500 flex items-center gap-1">
          <span>انتخاب شده:</span>
          <span className="font-bold text-turquoise-deep dark:text-turquoise-tile">
            {selectedIndices.length} از ۲ مورد
          </span>
        </div>

        {/* Grid of tiles */}
        <div
          className={`grid gap-2.5 w-full place-items-center ${
            gridCols === 4 ? 'grid-cols-4' : 'grid-cols-3'
          }`}
        >
          {items.map((item, idx) => {
            const isSelected = selectedIndices.includes(idx);
            const isCorrectTarget = correctAnswer.includes(idx);

            let borderClasses =
              'border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800';

            if (selectedIndices.length === 2) {
              if (isSelected) {
                borderClasses = isPairMatch
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-4 ring-emerald-500/20'
                  : 'border-pomegranate bg-rose-50 dark:bg-rose-950/40 animate-shake';
              } else if (isCorrectTarget) {
                borderClasses = 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20';
              }
            } else if (isSelected) {
              borderClasses = 'border-saffron bg-saffron-light/60 dark:bg-amber-950/40 ring-4 ring-saffron/20';
            }

            return (
              <button
                key={item.id}
                onClick={() => handleTap(idx)}
                disabled={disabled || selectedIndices.length >= 2}
                type="button"
                className={`w-full aspect-square min-w-[62px] min-h-[62px] rounded-2xl flex items-center justify-center transition-all ${
                  !reduceMotion ? 'active:scale-95 duration-150' : ''
                } shadow-xs hover:shadow-md cursor-pointer ${borderClasses}`}
                aria-label={`کارت ${idx + 1}`}
              >
                <RenderIcon
                  name={item.nameKey}
                  size={items.length === 8 ? 38 : 46}
                  color={item.color}
                  rotation={item.rotation}
                  variation={item.variation}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
