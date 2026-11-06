import React, { useState, useEffect } from 'react';
import { ChallengePayload } from '../../types';
import { RenderIcon } from '../icons';
import { sounds } from '../../lib/audio';

interface Props {
  payload: ChallengePayload;
  correctAnswer: string;
  onAnswer: (answer: string) => void;
  disabled: boolean;
  reduceMotion?: boolean;
}

export const WhatDisappearedGame: React.FC<Props> = ({
  payload,
  correctAnswer,
  onAnswer,
  disabled,
  reduceMotion
}) => {
  const [phase, setPhase] = useState<'memorize' | 'guess'>('memorize');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(2.5);

  const fullItems = payload.items || [];
  const options = payload.options || [];

  // Countdown timer for memory phase
  useEffect(() => {
    if (phase !== 'memorize') return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0.5) {
          clearInterval(interval);
          setPhase('guess');
          return 0;
        }
        return Math.max(0, +(prev - 0.5).toFixed(1));
      });
    }, 500);

    return () => clearInterval(interval);
  }, [phase]);

  const handleSelect = (key: string) => {
    if (disabled || selectedKey !== null || phase !== 'guess') return;
    setSelectedKey(key);
    sounds.playTap();
    sounds.vibrate(12);
    onAnswer(key);
  };

  const skipMemorize = () => {
    setPhase('guess');
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2">
      {phase === 'memorize' ? (
        <div className="w-full max-w-[340px] flex flex-col items-center">
          {/* Persian Tile Shelf */}
          <div className="w-full bg-white dark:bg-stone-800 rounded-3xl p-5 border-2 border-turquoise-tile/30 shadow-sm flex flex-col items-center gap-4">
            <div className="text-xs font-semibold text-turquoise-deep dark:text-turquoise-tile flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-saffron animate-ping" />
              <span>خوب نگاه کن و به یاد بسپار!</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 py-2">
              {fullItems.map((item) => (
                <div
                  key={item.id}
                  className="w-14 h-14 rounded-2xl bg-stone-50 dark:bg-stone-700/60 flex items-center justify-center shadow-xs"
                >
                  <RenderIcon name={item.nameKey} size={38} color={item.color} />
                </div>
              ))}
            </div>

            {/* Quick skip button */}
            <button
              onClick={skipMemorize}
              type="button"
              className="text-xs px-4 py-2 font-medium text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-700 rounded-xl hover:bg-stone-200 transition-colors"
            >
              دیدم، بریم سوال!
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[340px] flex flex-col items-center">
          {/* Platter with the missing slot */}
          <div className="w-full bg-stone-100/80 dark:bg-stone-800/60 rounded-3xl p-4 border border-stone-200 dark:border-stone-700 mb-4 flex items-center justify-center gap-2">
            {fullItems.map((item) => {
              const isMissing = item.nameKey === correctAnswer;
              if (isMissing) {
                return (
                  <div
                    key={item.id}
                    className="w-13 h-13 rounded-2xl border-2 border-dashed border-pomegranate/60 bg-rose-50/50 dark:bg-rose-950/20 flex items-center justify-center text-pomegranate font-display text-lg"
                  >
                    ؟
                  </div>
                );
              }
              return (
                <div
                  key={item.id}
                  className="w-13 h-13 rounded-2xl bg-white dark:bg-stone-700 flex items-center justify-center opacity-85 shadow-xs"
                >
                  <RenderIcon name={item.nameKey} size={32} color={item.color} />
                </div>
              );
            })}
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {options.map((opt) => {
              const isSelected = selectedKey === opt.nameKey;
              const isCorrectTarget = opt.nameKey === correctAnswer;

              let borderClasses =
                'border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800';

              if (selectedKey !== null) {
                if (isSelected) {
                  borderClasses = isCorrectTarget
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-4 ring-emerald-500/20'
                    : 'border-pomegranate bg-rose-50 dark:bg-rose-950/40';
                } else if (isCorrectTarget) {
                  borderClasses = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/20';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.nameKey)}
                  disabled={disabled || selectedKey !== null}
                  type="button"
                  className={`min-h-[74px] p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all ${
                    !reduceMotion ? 'active:scale-95 duration-150' : ''
                  } shadow-xs hover:shadow-md cursor-pointer ${borderClasses}`}
                >
                  <RenderIcon name={opt.nameKey} size={44} color={opt.color} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
