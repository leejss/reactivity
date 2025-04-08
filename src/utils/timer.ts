/**
 * A timer function that uses requestAnimationFrame for smoother performance
 * @param duration Duration in milliseconds
 * @param callback Function to execute when timer completes
 * @returns Object with cancel method to stop the timer
 */
export function timer(duration: number, callback: () => void) {
  const startTime = performance.now();
  let animationFrameId: number;

  const cancel = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };

  const tick = (currentTime: number) => {
    const elapsed = currentTime - startTime;

    if (elapsed >= duration) {
      cancel(); // Auto-cancel when timer completes
      callback();
      return;
    }

    animationFrameId = requestAnimationFrame(tick);
  };

  animationFrameId = requestAnimationFrame(tick);

  return {
    cancel,
  };
}
