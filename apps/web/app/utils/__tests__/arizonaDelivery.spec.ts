import { formatArizonaDeliveryWindow, getArizonaShipping } from '~/utils/arizonaDelivery';

// Times are given in German time (CET/CEST offsets)
describe('arizonaDelivery', () => {
  it('ships on Monday and delivers Tuesday to Thursday for an order on Sunday evening', () => {
    const now = new Date('2026-10-25T21:00:00+01:00');
    expect(getArizonaShipping(now).shipsToday).toBe(false);
    expect(getArizonaShipping(now).shippingDayLabel).toBe('morgen');
    expect(formatArizonaDeliveryWindow(now)).toBe('Di, 27. Okt – Do, 29. Okt');
  });

  it('ships the same day before 12:00 on a working day', () => {
    const now = new Date('2026-10-27T10:30:00+01:00');
    const shipping = getArizonaShipping(now);
    expect(shipping.shipsToday).toBe(true);
    expect(shipping.minutesLeft).toBe(90);
    expect(formatArizonaDeliveryWindow(now)).toBe('Mi, 28. Okt – Fr, 30. Okt');
  });

  it('moves a Friday afternoon order to Monday and delivers on Saturday at the earliest otherwise', () => {
    expect(getArizonaShipping(new Date('2026-10-30T13:00:00+01:00')).shippingDayLabel).toBe('am Montag');
    expect(formatArizonaDeliveryWindow(new Date('2026-10-30T09:00:00+01:00'))).toBe('Sa, 31. Okt – Di, 3. Nov');
  });

  it('skips Christmas and Sundays for delivery', () => {
    expect(formatArizonaDeliveryWindow(new Date('2026-12-24T10:00:00+01:00'))).toBe('Mo, 28. Dez – Mi, 30. Dez');
  });

  it('does not ship on public holidays of Rheinland-Pfalz', () => {
    // 4 June 2026 is Fronleichnam
    expect(getArizonaShipping(new Date('2026-06-04T09:00:00+02:00')).shipsToday).toBe(false);
  });
});
