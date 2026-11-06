import React, { useState } from 'react';
import { ChallengePayload } from '../../types';
import { RenderIcon } from '../icons';
import { Check, X } from 'lucide-react';
import { sounds } from '../../lib/audio';

interface Props {
  payload: ChallengePayload;
  correctAnswer: 'SAME' | 'DIFFERENT';
  onAnswer: (answer: 'SAME' | 'DIFFERENT') => void;
  disabled: boolean;
  reduceMotion?: boolean;
}

export const SameOrDifferentGame: React.FC<Props> = ({
  payload,
  correctAnswer,
  onAnswer,
  disabled,
  reduceMotion
}) => {
  const [selectedChoice, setSelectedChoice] = useState<'SAME' | 'DIFFERENT' | null>(null);

  const left = payload.pairLeft;
  const right = payload.pairRight;

  const handleSelect = (choice: 'SAME' | 'DIFFERENT') => {
    if (disabled || selectedChoice !== null) return;
    setSelectedChoice(choice);
    sounds.playTap();
    sounds.vibrate(12);
    onAnswer(choice);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2">
      <div className="w-full max-w-[340px] flex flex-col items-center gap-4">
        {/* Comparison Side by Side */}
        <div className="w-full grid grid-cols-2 gap-3 items-center">
          <div className="w-full aspect-square rounded-3xl bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 flex flex-col items-center justify-center shadow-xs">
            {left && (
              <RenderIcon
                name={left.nameKey}
                size={68}
                color={left.color}
                rotation={left.rotation}
                variation={left.variation}
              />
            )}
          </div>

          <div className="w-full aspect-square rounded-3xl bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 flex flex-col items-center justify-center shadow-xs">
            {right && (
              <RenderIcon
                name={right.nameKey}
                size={68}
                color={right.color}
                rotation={right.rotation}
                variation={right.variation}
              />
            )}
          </div>
        </div>

        {/* Two Huge Primary Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full pt-1">
          {/* Same Button */}
          <button
            onClick={() => handleSelect('SAME')}
            disabled={disabled || selectedChoice !== null}
            type="button"
            className={`min-h-[70px] rounded-2xl flex items-center justify-center gap-2 font-display text-lg transition-all ${
              !reduceMotion ? 'active:scale-95 duration-150' : ''
            } shadow-sm border-2 cursor-pointer ${
              selectedChoice === 'SAME'
                ? correctAnswer === 'SAME'
                  ? 'bg-emerald-600 border-emerald-700 text-white ring-4 ring-emerald-500/20'
                  : 'bg-pomegranate border-rose-800 text-white'
                : selectedChoice !== null && correctAnswer === 'SAME'
                ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Check className="w-6 h-6 stroke-[3]" />
            <span>یکسان است</span>
          </button>

          {/* Different Button */}
          <button
            onClick={() => handleSelect('DIFFERENT')}
            disabled={disabled || selectedChoice !== null}
            type="button"
            className={`min-h-[70px] rounded-2xl flex items-center justify-center gap-2 font-display text-lg transition-all ${
              !reduceMotion ? 'active:scale-95 duration-150' : ''
            } shadow-sm border-2 cursor-pointer ${
              selectedChoice === 'DIFFERENT'
                ? correctAnswer === 'DIFFERENT'
                  ? 'bg-emerald-600 border-emerald-700 text-white ring-4 ring-emerald-500/20'
                  : 'bg-pomegranate border-rose-800 text-white'
                : selectedChoice !== null && correctAnswer === 'DIFFERENT'
                ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-pomegranate dark:text-rose-200 hover:bg-rose-100'
            }`}
          >
            <X className="w-6 h-6 stroke-[3]" />
            <span>فرق دارند</span>
          </button>
        </div>
      </div>
    </div>
  );
};
