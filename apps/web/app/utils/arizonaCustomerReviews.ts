import { orderGetters, type ActiveShippingCountry, type Order } from '@plentymarkets/shop-api';
import { getArizonaShipping } from '~/utils/arizonaDelivery';
import { getArizonaGtin13 } from '~/utils/arizonaSchema';

/**
 * Arizona: data for the Google Customer Reviews survey opt-in (Merchant Center account 9083127).
 * Estimated delivery date = latest day of the delivery window shown in the shop (utils/arizonaDelivery.ts), counted
 * from the order time; outside Germany DHL needs up to two more delivery days.
 */
export const GOOGLE_MERCHANT_ID = 9_083_127;
const EXTRA_DAYS_ABROAD = 2;

const isoDay = (day: Date) => day.toISOString().slice(0, 10);

export const getArizonaEstimatedDeliveryDate = (orderDate: Date, countryCode: string) => {
  const latest = getArizonaShipping(orderDate).latest;
  let day = latest;
  if (countryCode !== 'DE') {
    for (let added = 0; added < EXTRA_DAYS_ABROAD;) {
      day = new Date(day.getTime() + 86_400_000);
      if (day.getUTCDay() !== 0) added++;
    }
  }
  return isoDay(day);
};

export const getArizonaCustomerReviewsOptIn = (order: Order, countries: ActiveShippingCountry[]) => {
  const details = order?.order;
  const email = orderGetters.getOrderEmail(order);
  const countryCode = countries.find((country) => country.id === details?.deliveryAddress?.countryId)?.isoCode2 ?? '';
  if (!details || !email || !countryCode) return null;

  const created = new Date(details.createdAt);
  const gtins = [
    ...new Set(
      orderGetters
        .getItems(order)
        .filter((item) => !orderGetters.isBundleItem(item) && !orderGetters.isCouponItem(item))
        .map((item) => order.variations?.[String(orderGetters.getItemVariationId(item))])
        .map((product) => (product ? getArizonaGtin13(product) : ''))
        .filter(Boolean),
    ),
  ];

  return {
    order_id: orderGetters.getId(order),
    email,
    delivery_country: countryCode,
    estimated_delivery_date: getArizonaEstimatedDeliveryDate(
      Number.isNaN(created.getTime()) ? new Date() : created,
      countryCode,
    ),
    ...(gtins.length ? { products: gtins.map((gtin) => ({ gtin })) } : {}),
  };
};
