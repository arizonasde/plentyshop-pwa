import { describe, expect, it } from 'vitest';
import { getArizonaFreeShippingProgress } from '../arizonaShipping';

describe('getArizonaFreeShippingProgress', () => {
  it('shows the remaining amount below the threshold', () => {
    expect(getArizonaFreeShippingProgress(49.5)).toEqual({ remaining: 49.5, percent: 50, reached: false });
  });

  it('is reached from 99 EUR on', () => {
    expect(getArizonaFreeShippingProgress(99)).toEqual({ remaining: 0, percent: 100, reached: true });
    expect(getArizonaFreeShippingProgress(240.57)).toEqual({ remaining: 0, percent: 100, reached: true });
  });

  it('handles an empty cart', () => {
    expect(getArizonaFreeShippingProgress(0)).toEqual({ remaining: 99, percent: 0, reached: false });
  });

  it('avoids floating point leftovers', () => {
    expect(getArizonaFreeShippingProgress(98.99).remaining).toBe(0.01);
  });
});
