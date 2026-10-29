import { describe, expect, it } from 'vitest';
import type { PaymentMethod } from '@plentymarkets/shop-api';
import { getArizonaPaymentDisplay, sortArizonaPaymentMethods } from '../arizonaPayment';

const method = (id: number, name = `Methode ${id}`): PaymentMethod => ({
  id,
  name,
  fee: 0,
  icon: `https://example.com/${id}.png`,
  description: '',
  sourceUrl: '',
  isSelectable: true,
  key: '',
  paymentKey: '',
});

describe('getArizonaPaymentDisplay', () => {
  it('uses the Arizona title, description and logo', () => {
    expect(getArizonaPaymentDisplay(method(6033, 'Rechnungskauf'))).toEqual({
      title: 'Rechnung',
      description: 'Bezahlen Sie bequem per Rechnung.',
      logo: '/images/payment/rechnung.svg',
    });
  });

  it('keeps the plugin icon when no own logo is set', () => {
    expect(getArizonaPaymentDisplay(method(6001)).logo).toBe('https://example.com/6001.png');
  });

  it('falls back to the plugin name for unknown methods', () => {
    expect(getArizonaPaymentDisplay(method(6021, 'SOFORT'))).toEqual({
      title: 'SOFORT',
      description: '',
      logo: 'https://example.com/6021.png',
    });
  });
});

describe('sortArizonaPaymentMethods', () => {
  it('follows the Arizona order and keeps unknown methods at the end in their order', () => {
    const sorted = sortArizonaPaymentMethods([6059, 6074, 6078, 6057, 6001, 6033, 6020, 6019, 6021].map((id) => method(id)));
    expect(sorted.map((m) => m.id)).toEqual([6033, 6001, 6059, 6074, 6057, 6020, 6078, 6019, 6021]);
  });
});
