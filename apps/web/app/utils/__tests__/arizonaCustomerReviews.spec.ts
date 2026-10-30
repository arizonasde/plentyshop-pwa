import { describe, expect, it } from 'vitest';
import type { ActiveShippingCountry, Order } from '@plentymarkets/shop-api';
import { getArizonaCustomerReviewsOptIn, getArizonaEstimatedDeliveryDate } from '../arizonaCustomerReviews';

const countries = [
  { id: 1, isoCode2: 'DE' },
  { id: 2, isoCode2: 'AT' },
] as unknown as ActiveShippingCountry[];

const order = (countryId = 1) =>
  ({
    order: {
      id: 4711,
      createdAt: '2026-10-28T09:00:00+01:00',
      deliveryAddress: { countryId, options: [{ typeId: 5, value: 'kunde@example.com' }] },
      billingAddress: { options: [{ typeId: 5, value: 'kunde@example.com' }] },
      orderItems: [
        { id: 1, itemVariationId: 100, typeId: 1 },
        { id: 2, itemVariationId: 101, typeId: 1 },
        { id: 3, itemVariationId: 100, typeId: 1 },
        { id: 4, itemVariationId: 0, typeId: 6 },
      ],
    },
    variations: {
      100: { barcodes: [{ id: 19, code: '4066887273872' }] },
      101: { barcodes: [{ id: 1, code: 'ABC' }] },
    },
  }) as unknown as Order;

describe('getArizonaEstimatedDeliveryDate', () => {
  it('uses the last day of the shop delivery window', () => {
    // Wed 28 Oct before 12:00 ships the same day, DHL 1–3 days: Thu, Fri, Sat
    expect(getArizonaEstimatedDeliveryDate(new Date('2026-10-28T09:00:00+01:00'), 'DE')).toBe('2026-10-31');
  });

  it('adds two delivery days abroad and skips Sunday', () => {
    expect(getArizonaEstimatedDeliveryDate(new Date('2026-10-28T09:00:00+01:00'), 'AT')).toBe('2026-11-03');
  });
});

describe('getArizonaCustomerReviewsOptIn', () => {
  it('builds the opt-in data with unique GTINs', () => {
    const options = getArizonaCustomerReviewsOptIn(order(), countries);
    expect(options).toMatchObject({
      order_id: '4711',
      email: 'kunde@example.com',
      delivery_country: 'DE',
      estimated_delivery_date: '2026-10-31',
      products: [{ gtin: '4066887273872' }],
    });
  });

  it('returns null without a known delivery country', () => {
    expect(getArizonaCustomerReviewsOptIn(order(99), countries)).toBeNull();
  });
});
