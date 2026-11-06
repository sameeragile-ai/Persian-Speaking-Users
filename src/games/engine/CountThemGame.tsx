import React, { useState } from 'react';
import { ChallengePayload } from '../../types';
import { RenderIcon } from '../icons';
import { toPersianDigits } from '../../i18n';
import { sounds } from '../../lib/audio';

interface Props {
  payload: ChallengePayload;
  correctAnswer: number;
  onAnswer: (answer: number) => void;
  disabled: boolean;
  reduceMotion?: boolean;
}

export const CountThemGame: React.FC<Props> = ({
  payload,
  correctAnswer,
  onAnswer,
  disabled,
  reduceMotion
}) => {
  const [selectedNum, setSelectedNum] = useState<number | null>(null);

  const sceneItems = payload.items || [];
  const targetItem = payload.targetItem;
  const options = (payload.options as number[]) || [3, 4, 5, 6];

  const handleSelect = (num: number) => {
    if (disabled || selectedNum !== null) return;
    setSelectedNum(num);
    sounds.playTap();
    sounds.vibrate(12);
    onAnswer(num);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2">
      <div className="w-full max-w-[340px] flex flex-col items-center gap-3">
        {/* Target Indicator Card */}
        {targetItem && (
          <div className="w-full bg-white dark:bg-stone-800 rounded-2xl py-2 px-4 border border-stone-200 dark:border-stone-700 shadow-xs flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              هدف شمارش:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-stone-500">فقط این شکل را بشمارید</span>
              <div className="w-10 h-10 rounded-xl bg-saffron-light/60 dark:bg-stone-700 flex items-center justify-center border border-saffron/40">
                <RenderIcon name={targetItem.nameKey} size={28} color="#C8323C" />
              </div>
            </div>
          </div>
        )}

        {/* Scene Container */}
        <div className="w-full h-44 bg-white dark:bg-stone-800/90 rounded-3xl p-3 border-2 border-turquoise-tile/20 shadow-xs relative overflow-hidden flex flex-wrap items-center justify-center gap-2.5 content-center">
          {sceneItems.map((item) => (
            <div
              key={item.id}
              style={{
                transform: `rotate(${((parseInt(item.id.replace(/\D/g, ''), 10) * 45) % 90) - 20}deg)`
              }}
              className="p-1 transition-transform"
            >
              <RenderIcon
                name={item.nameKey}
                size={item.size || 38}
                color={item.color}
              />
            </div>
          ))}
        </div>

        {/* 4 Big Number Buttons */}
        <div className="grid grid-cols-4 gap-2.5 w-full pt-1">
          {options.map((num) => {
            const isSelected = selectedNum === num;
            const isCorrectTarget = num === correctAnswer;

            let btnClasses =
              'border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100';

            if (selectedNum !== null) {
              if (isSelected) {
                btnClasses = isCorrectTarget
                  ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
                  : 'border-pomegranate bg-pomegranate text-white';
              } else if (isCorrectTarget) {
                btnClasses = 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200';
              }
            }

            return (
              <button
                key={num}
                onClick={() => handleSelect(num)}
                disabled={disabled || selectedNum !== null}
                type="button"
                className={`min-h-[64px] rounded-2xl flex items-center justify-center font-display text-2xl transition-all ${
                  !reduceMotion ? 'active:scale-95 duration-150' : ''
                } shadow-xs hover:shadow-md cursor-pointer ${btnClasses}`}
              >
                {toPersianDigits(num)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
