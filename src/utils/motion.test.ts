import { MOTION, motionDuration } from './motion';

describe('motionDuration', () => {
  it('scales duration with playback speed and caps motion below dwell time', () => {
    expect(motionDuration(MOTION.moveMs, 1)).toBe(360);
    expect(motionDuration(MOTION.arrowMs, 1)).toBe(420);
    expect(motionDuration(MOTION.moveMs, 2)).toBe(180);
  });

  it('disables transitions for reduced motion and invalid speeds', () => {
    expect(motionDuration(MOTION.moveMs, 1, true)).toBe(0);
    expect(motionDuration(MOTION.moveMs, 0)).toBe(0);
  });
});
