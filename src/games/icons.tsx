import React from 'react';

export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  rotation?: number;
  variation?: number; // for slight detail differences
}

export const PersianIcons: Record<string, React.FC<IconProps>> = {
  // 1. Pomegranate (انار)
  pomegranate: ({ size = 48, color = '#C8323C', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      {/* Crown / Calyx */}
      <path
        d="M26 12L28 6L32 10L36 6L38 12Z"
        fill={variation === 1 ? '#A8252E' : color}
        stroke="#7A151C"
        strokeWidth="2"
      />
      {/* Body */}
      <circle cx="32" cy="38" r="22" fill={color} stroke="#7A151C" strokeWidth="2.5" />
      {/* Subtle shine / seeds hint */}
      <path
        d="M24 24C28 20 34 20 38 24"
        stroke="#FFA4A8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {variation === 2 ? (
        <circle cx="32" cy="40" r="4" fill="#FFA4A8" />
      ) : (
        <path d="M26 36C28 42 36 42 38 36" stroke="#9E1E26" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  ),

  // 2. Tea Glass (استکان چای)
  tea_glass: ({ size = 48, color = '#B83A14', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      {/* Glass Body with narrow waist */}
      <path
        d="M20 14H44L40 32C39 37 42 46 42 52H22C22 46 25 37 24 32L20 14Z"
        fill="#E6F4F3"
        stroke="#0E6E73"
        strokeWidth="2.5"
      />
      {/* Tea liquid level */}
      <path
        d="M23 26H41L39 34C38 39 41 46 41 50H23C23 46 26 39 25 34L23 26Z"
        fill={color}
      />
      {/* Saucer / Nabat */}
      <ellipse cx="32" cy="56" rx="20" ry="3.5" fill="#3FA7A3" stroke="#0E6E73" strokeWidth="2" />
      {variation === 1 && (
        <path d="M28 20Q32 16 36 20" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  ),

  // 3. Samovar (سماور)
  samovar: ({ size = 48, color = '#E8A317', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      <rect x="22" y="10" width="20" height="6" rx="2" fill="#D98A0D" />
      <path d="M18 16H46L42 40H22L18 16Z" fill={color} stroke="#A86608" strokeWidth="2.5" />
      <rect x="26" y="40" width="12" height="12" fill="#D98A0D" stroke="#A86608" strokeWidth="2" />
      <path d="M16 52H48L44 56H20L16 52Z" fill="#8C5305" />
      {/* Tap / Spout */}
      <path d="M42 32H48V36H44" stroke="#8C5305" strokeWidth="2.5" strokeLinecap="round" />
      {/* Handles */}
      <path d="M18 24C12 24 12 32 18 32" stroke="#8C5305" strokeWidth="2.5" />
      <path d="M46 24C52 24 52 32 46 32" stroke="#8C5305" strokeWidth="2.5" />
    </svg>
  ),

  // 4. Fish (ماهی قرمز)
  fish: ({ size = 48, color = '#F26419', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      <path
        d="M48 32C48 40 34 46 22 42L10 50V14L22 22C34 18 48 24 48 32Z"
        fill={color}
        stroke="#C03A00"
        strokeWidth="2.5"
      />
      {/* Eye */}
      <circle cx="38" cy="28" r="3" fill="#FFFFFF" />
      <circle cx="39" cy="28" r="1.5" fill="#1C1917" />
      {/* Fin */}
      <path d="M26 32C24 38 28 40 32 38" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // 5. Cypress Tree (درخت سرو)
  cypress: ({ size = 48, color = '#15803D', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      {/* Classic Persian slender cypress with tipped peak */}
      <path
        d="M32 6C35 12 44 26 42 46C41 50 38 52 32 52C26 52 23 50 22 46C20 26 29 12 32 6Z"
        fill={color}
        stroke="#0F5128"
        strokeWidth="2.5"
      />
      {/* Trunk */}
      <rect x="30" y="52" width="4" height="6" fill="#78350F" />
      {variation === 1 && (
        <path d="M32 14V44" stroke="#22C55E" strokeWidth="2" strokeDasharray="3 3" />
      )}
    </svg>
  ),

  // 6. Persian Star / Shamseh (شمسه / ستاره ۸ پر)
  star: ({ size = 48, color = '#0E6E73', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      <rect x="16" y="16" width="32" height="32" rx="2" fill={color} />
      <rect
        x="16"
        y="16"
        width="32"
        height="32"
        rx="2"
        fill={color}
        transform="rotate(45 32 32)"
      />
      <circle cx="32" cy="32" r="7" fill={variation === 1 ? '#C8323C' : '#F2A007'} />
    </svg>
  ),

  // 7. Bird (پرنده / سیمرغ)
  bird: ({ size = 48, color = '#0284C7', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      {/* Tail feathers */}
      <path d="M12 42C18 36 22 34 26 34" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* Body */}
      <path
        d="M22 36C24 24 36 20 44 24C48 26 54 28 56 26C52 32 46 36 38 38C28 40 24 38 22 36Z"
        fill={color}
        stroke="#0369A1"
        strokeWidth="2"
      />
      {/* Eye & Beak */}
      <circle cx="48" cy="26" r="2" fill="#FFFFFF" />
      <path d="M54 28L60 30L53 32Z" fill="#F2A007" />
    </svg>
  ),

  // 8. Persian Flower / Gol-o-Bolbol (گل شاه‌عباسی)
  flower: ({ size = 48, color = '#E11D48', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      <circle cx="32" cy="20" r="8" fill={color} opacity="0.9" />
      <circle cx="44" cy="32" r="8" fill={color} opacity="0.9" />
      <circle cx="32" cy="44" r="8" fill={color} opacity="0.9" />
      <circle cx="20" cy="32" r="8" fill={color} opacity="0.9" />
      <circle cx="32" cy="32" r="9" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
    </svg>
  ),

  // 9. Kite (بادبادک)
  kite: ({ size = 48, color = '#8B5CF6', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      <polygon points="32,8 50,28 32,50 14,28" fill={color} stroke="#6D28D9" strokeWidth="2.5" />
      <line x1="32" y1="8" x2="32" y2="50" stroke="#DDD6FE" strokeWidth="1.5" />
      <line x1="14" y1="28" x2="50" y2="28" stroke="#DDD6FE" strokeWidth="1.5" />
      {/* Tail Ribbon */}
      <path d="M32 50C36 54 30 58 34 62" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),

  // 10. Apple (سیب هفت سین)
  apple: ({ size = 48, color = '#DC2626', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      {/* Stem & Leaf */}
      <path d="M32 18C34 12 38 10 38 10" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="41" cy="14" rx="4" ry="2.5" fill="#22C55E" transform="rotate(-20 41 14)" />
      {/* Apple fruit */}
      <path
        d="M32 22C26 18 16 20 16 32C16 46 26 52 32 52C38 52 48 46 48 32C48 20 38 18 32 22Z"
        fill={color}
        stroke="#991B1B"
        strokeWidth="2.5"
      />
    </svg>
  ),

  // 11. Watermelon Slice (قاچ هندوانه شب یلدا)
  watermelon: ({ size = 48, color = '#EF4444', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      {/* Rind */}
      <path d="M12 28C14 46 48 46 52 28" fill="#15803D" stroke="#166534" strokeWidth="2.5" />
      <path d="M14 28C16 43 46 43 50 28" fill="#86EFAC" />
      {/* Flesh */}
      <path d="M16 28C18 41 44 41 48 28Z" fill={color} />
      {/* Seeds */}
      <circle cx="26" cy="32" r="1.5" fill="#18181B" />
      <circle cx="32" cy="35" r="1.5" fill="#18181B" />
      <circle cx="38" cy="32" r="1.5" fill="#18181B" />
    </svg>
  ),

  // 12. Book / Divan Hafez (دیوان حافظ / کتاب)
  book: ({ size = 48, color = '#0E6E73', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      <path
        d="M14 18C20 16 30 18 32 22C34 18 44 16 50 18V48C44 46 34 48 32 52C30 48 20 46 14 48V18Z"
        fill="#FEF3C7"
        stroke={color}
        strokeWidth="2.5"
      />
      <line x1="32" y1="22" x2="32" y2="52" stroke={color} strokeWidth="2.5" />
      {variation === 1 && (
        <circle cx="42" cy="34" r="3" fill="#D97706" />
      )}
    </svg>
  ),

  // 13. Cat (گربه ایرانی)
  cat: ({ size = 48, color = '#78716C', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      {/* Head with pointy ears */}
      <polygon points="18,14 26,24 16,28" fill={color} />
      <polygon points="46,14 48,28 38,24" fill={color} />
      <circle cx="32" cy="34" r="16" fill={color} stroke="#44403C" strokeWidth="2" />
      {/* Eyes */}
      <ellipse cx="26" cy="32" rx="3" ry="4" fill="#FACC15" />
      <ellipse cx="38" cy="32" rx="3" ry="4" fill="#FACC15" />
      <circle cx="26" cy="32" r="1.5" fill="#000" />
      <circle cx="38" cy="32" r="1.5" fill="#000" />
      {/* Nose */}
      <polygon points="32,38 30,36 34,36" fill="#F43F5E" />
    </svg>
  ),

  // 14. Sun / Khorshid Khanom (خورشید خانم)
  sun: ({ size = 48, color = '#F59E0B', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      {/* Rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line
          key={i}
          x1="32"
          y1="8"
          x2="32"
          y2="14"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          transform={`rotate(${angle} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="14" fill={color} stroke="#D97706" strokeWidth="2" />
      {/* Kind smile */}
      <circle cx="28" cy="30" r="1.8" fill="#78350F" />
      <circle cx="36" cy="30" r="1.8" fill="#78350F" />
      <path d="M28 35Q32 38 36 35" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  ),

  // 15. Crescent Moon (هلال ماه)
  moon: ({ size = 48, color = '#FDE047', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      <path
        d="M38 12C24 12 16 22 16 34C16 46 26 54 38 54C42 54 48 52 50 50C36 48 30 36 34 22C36 16 42 14 42 14C40 12 39 12 38 12Z"
        fill={color}
        stroke="#CA8A04"
        strokeWidth="2.5"
      />
    </svg>
  ),

  // 16. Ancient Key (کلید قدیمی)
  key: ({ size = 48, color = '#B45309', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      <circle cx="20" cy="24" r="10" stroke={color} strokeWidth="4" fill="none" />
      <rect x="28" y="22" width="24" height="4" rx="2" fill={color} />
      <rect x="44" y="26" width="4" height="7" rx="1" fill={color} />
      <rect x="36" y="26" width="4" height="5" rx="1" fill={color} />
    </svg>
  ),

  // 17. Cup / Piyaleh (پیاله فیروزه)
  cup: ({ size = 48, color = '#0E6E73', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      <path
        d="M16 20H48C48 36 40 46 32 46C24 46 16 36 16 20Z"
        fill={color}
        stroke="#084C50"
        strokeWidth="2.5"
      />
      <rect x="28" y="46" width="8" height="6" fill="#084C50" />
      <ellipse cx="32" cy="52" rx="10" ry="2" fill="#084C50" />
      {/* Pattern band */}
      <path d="M20 28H44" stroke="#F2A007" strokeWidth="2.5" strokeDasharray="3 3" />
    </svg>
  ),

  // 18. Boat (قایق سنتی)
  boat: ({ size = 48, color = '#3FA7A3', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      <path d="M12 36H52L44 48H20L12 36Z" fill="#78350F" stroke="#451A03" strokeWidth="2" />
      {/* Sail */}
      <polygon points="32,12 46,32 32,32" fill={color} />
      <line x1="32" y1="10" x2="32" y2="36" stroke="#451A03" strokeWidth="2" />
      {/* Water ripple */}
      <path d="M10 52C16 50 24 54 32 52C40 50 48 54 54 52" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),

  // 19. Lantern / Fanoos (فانوس)
  lantern: ({ size = 48, color = '#D97706', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      <ellipse cx="32" cy="14" rx="8" ry="4" stroke="#78350F" strokeWidth="2" fill="none" />
      <path d="M24 20H40L38 42H26L24 20Z" fill="#FEF3C7" stroke="#78350F" strokeWidth="2" />
      {/* Flame inside */}
      <circle cx="32" cy="32" r="5" fill={color} />
      <rect x="22" y="42" width="20" height="8" rx="2" fill="#78350F" />
    </svg>
  ),

  // 20. Persian Tile (کاشی هفت‌رنگ)
  tile: ({ size = 48, color = '#0E6E73', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      <rect x="12" y="12" width="40" height="40" rx="4" fill={color} stroke="#084C50" strokeWidth="2" />
      <rect x="18" y="18" width="28" height="28" rx="2" fill="#3FA7A3" opacity="0.6" />
      <circle cx="32" cy="32" r="6" fill="#F2A007" />
    </svg>
  ),

  // 21. Persian Nightingale (بلبل خوش‌الحان)
  nightingale: ({ size = 48, color = '#F59E0B', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      <ellipse cx="34" cy="36" rx="14" ry="10" fill={color} />
      <circle cx="44" cy="26" r="8" fill={color} stroke="#B45309" strokeWidth="1.5" />
      <polygon points="52,26 58,28 52,30" fill="#DC2626" />
      <circle cx="46" cy="24" r="1.5" fill="#000" />
      <path d="M22 36L10 46L20 40Z" fill="#B45309" />
    </svg>
  ),

  // 22. Persian Turquoise Ring (انگشتر فیروزه)
  ring: ({ size = 48, color = '#0E6E73', rotation = 0, variation = 0, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
    >
      <circle cx="32" cy="38" r="14" stroke="#F59E0B" strokeWidth="4" fill="none" />
      <ellipse cx="32" cy="22" rx="10" ry="7" fill={color} stroke="#F59E0B" strokeWidth="2" />
      <ellipse cx="30" cy="20" rx="3" ry="2" fill="#E6F4F3" opacity="0.7" />
    </svg>
  )
};

export const AVAILABLE_ICON_KEYS = Object.keys(PersianIcons);

export const ICON_NAME_MAP_FA: Record<string, string> = {
  pomegranate: 'انار سرخ',
  tea_glass: 'استکان چای',
  samovar: 'سماور طلا',
  fish: 'ماهی قرمز',
  cypress: 'سرو سرسبز',
  star: 'شمسه هشت‌پر',
  bird: 'پرنده آوازخوان',
  flower: 'گل شاه‌عباسی',
  kite: 'بادبادک رنگی',
  apple: 'سیب سرخ',
  watermelon: 'قاچ هندوانه',
  book: 'دیوان شعر',
  cat: 'گربه ایرانی',
  sun: 'خورشید خانم',
  moon: 'هلال ماه',
  key: 'کلید کهن',
  cup: 'پیاله فیروزه',
  boat: 'قایق چوبی',
  lantern: 'فانوس روشن',
  tile: 'کاشی سنتی',
  nightingale: 'بلبل باغ',
  ring: 'نگین فیروزه'
};

export const ICON_NAME_MAP_EN: Record<string, string> = {
  pomegranate: 'Red Pomegranate',
  tea_glass: 'Persian Tea',
  samovar: 'Golden Samovar',
  fish: 'Little Redfish',
  cypress: 'Green Cypress',
  star: '8-Point Star',
  bird: 'Garden Bird',
  flower: 'Shah Abbasi Flower',
  kite: 'Color Kite',
  apple: 'Red Apple',
  watermelon: 'Watermelon Slice',
  book: 'Poetry Book',
  cat: 'Persian Cat',
  sun: 'Smiling Sun',
  moon: 'Crescent Moon',
  key: 'Antique Key',
  cup: 'Turquoise Cup',
  boat: 'Wooden Boat',
  lantern: 'Warm Lantern',
  tile: 'Persian Tile',
  nightingale: 'Nightingale',
  ring: 'Turquoise Gem'
};

export function RenderIcon({
  name,
  size = 48,
  color,
  rotation = 0,
  variation = 0,
  className = ''
}: {
  name: string;
  size?: number;
  color?: string;
  rotation?: number;
  variation?: number;
  className?: string;
}) {
  const Component = PersianIcons[name] || PersianIcons.pomegranate;
  return (
    <Component
      size={size}
      color={color}
      rotation={rotation}
      variation={variation}
      className={className}
    />
  );
}
