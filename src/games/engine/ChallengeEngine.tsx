import React, { useRef } from 'react';
import { Challenge } from '../../types';
import { FindDifferentGame } from './FindDifferentGame';
import { WhatDisappearedGame } from './WhatDisappearedGame';
import { CountThemGame } from './CountThemGame';
import { SameOrDifferentGame } from './SameOrDifferentGame';
import { MatchPairGame } from './MatchPairGame';
import { Search, Eye, Sparkles, Scale, Layers } from 'lucide-react';

interface Props {
  challenge: Challenge;
  onAnswerLogged: (answer: any, isCorrect: boolean, msTaken: number) => void;
  disabled: boolean;
  reduceMotion?: boolean;
}

export const ChallengeEngine: React.FC<Props> = ({
  challenge,
  onAnswerLogged,
  disabled,
  reduceMotion
}) => {
  const startTimeRef = useRef<number>(Date.now());

  // Reset timer on new challenge
  React.useEffect(() => {
    startTimeRef.current = Date.now();
  }, [challenge.id]);

  const handleAnswer = (answer: any) => {
    const msTaken = Math.max(120, Date.now() - startTimeRef.current);
    let isCorrect = false;

    if (challenge.type === 'find_different') {
      isCorrect = answer === challenge.correctAnswer;
    } else if (challenge.type === 'what_disappeared') {
      isCorrect = answer === challenge.correctAnswer;
    } else if (challenge.type === 'count_them') {
      isCorrect = answer === challenge.correctAnswer;
    } else if (challenge.type === 'same_or_different') {
      isCorrect = answer === challenge.correctAnswer;
    } else if (challenge.type === 'match_pair') {
      const correctArr = challenge.correctAnswer as number[];
      const userArr = answer as number[];
      isCorrect =
        userArr.length === 2 &&
        correctArr.includes(userArr[0]) &&
        correctArr.includes(userArr[1]);
    }

    onAnswerLogged(answer, isCorrect, msTaken);
  };

  const getHintIcon = () => {
    switch (challenge.type) {
      case 'find_different':
        return <Search className="w-5 h-5 text-saffron stroke-[2.5]" />;
      case 'what_disappeared':
        return <Eye className="w-5 h-5 text-turquoise-tile stroke-[2.5]" />;
      case 'count_them':
        return <Sparkles className="w-5 h-5 text-amber-500 stroke-[2.5]" />;
      case 'same_or_different':
        return <Scale className="w-5 h-5 text-emerald-600 stroke-[2.5]" />;
      case 'match_pair':
        return <Layers className="w-5 h-5 text-indigo-500 stroke-[2.5]" />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Big Animated Icon Hint + Persian 1-Line Instruction */}
      <div className="flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-stone-100/90 dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700/60 text-xs font-semibold text-stone-700 dark:text-stone-200">
        <span className={!reduceMotion ? 'animate-bounce' : ''}>{getHintIcon()}</span>
        <span>{challenge.payload.hint}</span>
      </div>

      {/* Game Mechanic Content */}
      <div className="w-full">
        {challenge.type === 'find_different' && (
          <FindDifferentGame
            key={challenge.id}
            payload={challenge.payload}
            correctAnswer={challenge.correctAnswer}
            onAnswer={handleAnswer}
            disabled={disabled}
            reduceMotion={reduceMotion}
          />
        )}
        {challenge.type === 'what_disappeared' && (
          <WhatDisappearedGame
            key={challenge.id}
            payload={challenge.payload}
            correctAnswer={challenge.correctAnswer}
            onAnswer={handleAnswer}
            disabled={disabled}
            reduceMotion={reduceMotion}
          />
        )}
        {challenge.type === 'count_them' && (
          <CountThemGame
            key={challenge.id}
            payload={challenge.payload}
            correctAnswer={challenge.correctAnswer}
            onAnswer={handleAnswer}
            disabled={disabled}
            reduceMotion={reduceMotion}
          />
        )}
        {challenge.type === 'same_or_different' && (
          <SameOrDifferentGame
            key={challenge.id}
            payload={challenge.payload}
            correctAnswer={challenge.correctAnswer}
            onAnswer={handleAnswer}
            disabled={disabled}
            reduceMotion={reduceMotion}
          />
        )}
        {challenge.type === 'match_pair' && (
          <MatchPairGame
            key={challenge.id}
            payload={challenge.payload}
            correctAnswer={challenge.correctAnswer}
            onAnswer={handleAnswer}
            disabled={disabled}
            reduceMotion={reduceMotion}
          />
        )}
      </div>
    </div>
  );
};
