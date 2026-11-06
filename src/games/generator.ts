import { Challenge, GameType, SVGItemConfig } from '../types';
import { AVAILABLE_ICON_KEYS, ICON_NAME_MAP_FA, ICON_NAME_MAP_EN } from './icons';

// Simple mulberry32 PRNG for deterministic daily sets
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

const PALETTE = [
  '#C8323C', // pomegranate
  '#0E6E73', // deep turquoise
  '#3FA7A3', // tile turquoise
  '#F2A007', // saffron
  '#15803D', // garden green
  '#8B5CF6', // purple
  '#E11D48', // rose
  '#0284C7', // persian sky blue
  '#B45309'  // antique bronze
];

export function generateDailyChallengeSet(dateSeedStr: string, isPractice: boolean = false): Challenge[] {
  const seed = isPractice ? Math.floor(Math.random() * 1000000) : stringToSeed(dateSeedStr);
  const rand = mulberry32(seed);

  const chooseRandom = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const shuffle = <T>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // 15 challenges = 3 of each of the 5 game types
  const gameTypesDistribution: GameType[] = [
    'find_different', 'find_different', 'find_different',
    'what_disappeared', 'what_disappeared', 'what_disappeared',
    'count_them', 'count_them', 'count_them',
    'same_or_different', 'same_or_different', 'same_or_different',
    'match_pair', 'match_pair', 'match_pair'
  ];

  const shuffledTypes = shuffle(gameTypesDistribution);
  const challenges: Challenge[] = [];

  shuffledTypes.forEach((type, index) => {
    const challengeId = `c_${dateSeedStr}_${index + 1}`;

    if (type === 'find_different') {
      // 4 or 6 or 9 items
      const gridSize = index < 5 ? 4 : index < 10 ? 6 : 9;
      const baseIcon = chooseRandom(AVAILABLE_ICON_KEYS);
      const baseColor = chooseRandom(PALETTE);
      const diffType = Math.floor(rand() * 3); // 0: rotation, 1: color, 2: variation

      const differentIndex = Math.floor(rand() * gridSize);
      const items: SVGItemConfig[] = [];

      for (let i = 0; i < gridSize; i++) {
        if (i === differentIndex) {
          items.push({
            id: `item_${i}`,
            nameKey: baseIcon,
            color: diffType === 1 ? chooseRandom(PALETTE.filter((c) => c !== baseColor)) : baseColor,
            rotation: diffType === 0 ? 90 : 0,
            variation: diffType === 2 ? 1 : 0
          });
        } else {
          items.push({
            id: `item_${i}`,
            nameKey: baseIcon,
            color: baseColor,
            rotation: 0,
            variation: 0
          });
        }
      }

      challenges.push({
        id: challengeId,
        index: index + 1,
        type,
        titleKey: 'hint_find_different',
        hintKey: 'hint_find_different',
        payload: {
          hint: 'یکی از گزینه‌ها با بقیه تفاوت دارد',
          items,
          gridCols: gridSize === 9 ? 3 : gridSize === 6 ? 3 : 2
        },
        correctAnswer: differentIndex
      });
    } else if (type === 'what_disappeared') {
      // Show 5 distinct items, then hide one
      const count = 5;
      const chosenIcons = shuffle([...AVAILABLE_ICON_KEYS]).slice(0, count);
      const disappearedIndex = Math.floor(rand() * count);
      const disappearedKey = chosenIcons[disappearedIndex];

      const fullItems: SVGItemConfig[] = chosenIcons.map((key, i) => ({
        id: `mem_${i}`,
        nameKey: key,
        color: PALETTE[i % PALETTE.length],
        rotation: 0
      }));

      // 4 choices for which disappeared
      const distractorKeys = shuffle(
        AVAILABLE_ICON_KEYS.filter((k) => !chosenIcons.includes(k) && k !== disappearedKey)
      ).slice(0, 3);

      const options = shuffle([disappearedKey, ...distractorKeys]).map((key, idx) => ({
        id: `opt_${idx}`,
        nameKey: key,
        color: chooseRandom(PALETTE)
      }));

      challenges.push({
        id: challengeId,
        index: index + 1,
        type,
        titleKey: 'hint_what_disappeared',
        hintKey: 'hint_what_disappeared_pick',
        payload: {
          hint: 'کدام تصویر ناپدید شد؟',
          items: fullItems,
          options,
          targetItem: fullItems[disappearedIndex],
          memoryDurationMs: 2500
        },
        correctAnswer: disappearedKey
      });
    } else if (type === 'count_them') {
      // Mixed scene: target item count between 3 and 7, plus distractors
      const targetIcon = chooseRandom(AVAILABLE_ICON_KEYS);
      const targetCount = Math.floor(rand() * 4) + 3; // 3, 4, 5, 6
      const otherIcons = shuffle(AVAILABLE_ICON_KEYS.filter((k) => k !== targetIcon)).slice(0, 2);

      const sceneItems: SVGItemConfig[] = [];
      for (let i = 0; i < targetCount; i++) {
        sceneItems.push({
          id: `tgt_${i}`,
          nameKey: targetIcon,
          color: chooseRandom(PALETTE),
          size: Math.floor(rand() * 8) + 40
        });
      }

      // Add 4-6 distractors
      const distractorCount = Math.floor(rand() * 3) + 4;
      for (let i = 0; i < distractorCount; i++) {
        sceneItems.push({
          id: `dst_${i}`,
          nameKey: chooseRandom(otherIcons),
          color: chooseRandom(PALETTE),
          size: Math.floor(rand() * 8) + 36
        });
      }

      const shuffledScene = shuffle(sceneItems);

      // Generate 4 number options including targetCount
      const offsetSet = new Set<number>([targetCount]);
      while (offsetSet.size < 4) {
        const delta = Math.floor(rand() * 5) - 2; // -2 to +2
        const candidate = targetCount + delta;
        if (candidate > 0 && candidate <= 12) {
          offsetSet.add(candidate);
        }
      }
      const options = shuffle(Array.from(offsetSet));

      challenges.push({
        id: challengeId,
        index: index + 1,
        type,
        titleKey: 'hint_count_them',
        hintKey: 'hint_count_them',
        payload: {
          hint: 'چند تا از این شکل هست؟',
          items: shuffledScene,
          targetItem: { id: 'target_ref', nameKey: targetIcon, color: '#C8323C' },
          targetCount,
          options
        },
        correctAnswer: targetCount
      });
    } else if (type === 'same_or_different') {
      // Two pictures side by side
      const baseIcon = chooseRandom(AVAILABLE_ICON_KEYS);
      const isSame = rand() > 0.5;
      const baseColor = chooseRandom(PALETTE);

      const leftItem: SVGItemConfig = {
        id: 'left',
        nameKey: baseIcon,
        color: baseColor,
        rotation: 0
      };

      let rightItem: SVGItemConfig;
      if (isSame) {
        rightItem = {
          id: 'right',
          nameKey: baseIcon,
          color: baseColor,
          rotation: 0
        };
      } else {
        const diffMode = Math.floor(rand() * 3);
        if (diffMode === 0) {
          // Different icon
          const otherIcon = chooseRandom(AVAILABLE_ICON_KEYS.filter((k) => k !== baseIcon));
          rightItem = { id: 'right', nameKey: otherIcon, color: baseColor, rotation: 0 };
        } else if (diffMode === 1) {
          // Different color
          const otherColor = chooseRandom(PALETTE.filter((c) => c !== baseColor));
          rightItem = { id: 'right', nameKey: baseIcon, color: otherColor, rotation: 0 };
        } else {
          // Different rotation
          rightItem = { id: 'right', nameKey: baseIcon, color: baseColor, rotation: 90 };
        }
      }

      challenges.push({
        id: challengeId,
        index: index + 1,
        type,
        titleKey: 'hint_same_or_diff',
        hintKey: 'hint_same_or_diff',
        payload: {
          hint: 'آیا این دو شکل یکسان هستند؟',
          pairLeft: leftItem,
          pairRight: rightItem
        },
        correctAnswer: isSame ? 'SAME' : 'DIFFERENT'
      });
    } else if (type === 'match_pair') {
      // 6 or 8 items in a grid. Exactly 2 are identical (matching pair), others unique!
      const totalTiles = index < 8 ? 6 : 8;
      const uniqueNeeded = totalTiles - 1; // 1 pair + (totalTiles - 2) uniques
      const chosenIcons = shuffle([...AVAILABLE_ICON_KEYS]).slice(0, uniqueNeeded);
      const pairKey = chosenIcons[0];
      const pairColor = chooseRandom(PALETTE);

      const rawItems: { key: string; isTarget: boolean }[] = [
        { key: pairKey, isTarget: true },
        { key: pairKey, isTarget: true }
      ];

      for (let i = 1; i < uniqueNeeded; i++) {
        rawItems.push({ key: chosenIcons[i], isTarget: false });
      }

      const shuffledWithPos = shuffle(rawItems);
      const items: SVGItemConfig[] = shuffledWithPos.map((item, idx) => ({
        id: `tile_${idx}`,
        nameKey: item.key,
        color: item.isTarget ? pairColor : chooseRandom(PALETTE),
        rotation: 0
      }));

      const matchingIndices = items
        .map((it, idx) => (it.nameKey === pairKey ? idx : -1))
        .filter((idx) => idx !== -1);

      challenges.push({
        id: challengeId,
        index: index + 1,
        type,
        titleKey: 'hint_match_pair',
        hintKey: 'hint_match_pair',
        payload: {
          hint: 'دو تصویر یکسان را پیدا کن',
          items,
          gridCols: 3
        },
        correctAnswer: matchingIndices
      });
    }
  });

  return challenges;
}
