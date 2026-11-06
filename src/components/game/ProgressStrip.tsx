import React from 'react';
import { AnswerLog } from '../../types';

interface Props {
  total: number; // 15
  currentIndex: number; // 0 to 14
  answers: AnswerLog[];
}

export const ProgressStrip: React.FC<Props> = ({ total = 15, currentIndex, answers }) => {
  return (
    <div className="w-full flex items-center justify-between px-1 py-2">
      {Array.from({ length: total }, (_, idx) => {
        const isCurrent = idx === currentIndex;
        const answer = answers[idx];
        const isCompleted = answer !== undefined;
        const isCorrect = answer?.isCorrect;

        let dotClass = 'w-2.5 h-2.5 rounded-full transition-all duration-200 ';

        if (isCurrent) {
          dotClass += 'w-5 h-2.5 rounded-full bg-saffron shadow-sm ring-2 ring-saffron/30 animate-pulse';
        } else if (isCompleted) {
          if (isCorrect) {
            dotClass += 'bg-emerald-500';
          } else {
            dotClass += 'bg-pomegranate';
          }
        } else {
          dotClass += 'bg-stone-300 dark:bg-stone-700 opacity-60';
        }

        return (
          <div key={idx} className="flex items-center justify-center">
            <div className={dotClass} />
          </div>
        );
      })}
    </div>
  );
};
