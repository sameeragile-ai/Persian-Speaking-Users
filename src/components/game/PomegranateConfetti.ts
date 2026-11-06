import confetti from 'canvas-confetti';

/**
 * Pomegranate seed confetti burst for correct answers & victory
 */
export function firePomegranateBurst(reduceMotion: boolean = false) {
  if (reduceMotion) return;

  try {
    confetti({
      particleCount: 22,
      spread: 55,
      origin: { y: 0.65 },
      colors: ['#C8323C', '#E11D48', '#991B1B', '#F2A007', '#3FA7A3'],
      shapes: ['circle'],
      scalar: 0.7,
      ticks: 80,
      disableForReducedMotion: true
    });
  } catch {}
}

export function fireVictoryCelebration(reduceMotion: boolean = false) {
  if (reduceMotion) return;

  try {
    const end = Date.now() + 1200;
    const interval: any = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 25,
        spread: 360,
        ticks: 90,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#C8323C', '#F2A007', '#0E6E73', '#3FA7A3', '#E6F4F3'],
        scalar: 0.8
      });
    }, 200);
  } catch {}
}
