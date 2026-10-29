import type { PaymentMethod } from '@plentymarkets/shop-api';

/**
 * Arizona checkout display of payment methods: own title, short description, logo and order,
 * keyed by the plentyONE payment method id. Methods not listed keep their plugin name and icon
 * and are shown after the listed ones.
 */
export const ARIZONA_PAYMENT_DISPLAY: Record<number, { title: string; description: string; logo?: string }> = {
  6033: {
    title: 'Rechnung',
    description: 'Bezahlen Sie bequem per Rechnung.',
    logo: '/_nuxt-plenty/payment-logos/rechnung.svg',
  },
  6001: { title: 'PayPal', description: 'Bezahlen Sie bequem mit PayPal.' },
  6059: {
    title: 'Kreditkartenzahlung',
    description: 'Bezahlen Sie bequem mit Kredit-/Debitkarte.',
    logo: '/_nuxt-plenty/payment-logos/kreditkarte.svg',
  },
  6074: { title: 'Klarna', description: 'Bezahlen Sie bequem mit Klarna.' },
  6057: {
    title: 'Vorkasse',
    description: 'Bezahlen Sie bequem per Vorkasse.',
    logo: '/_nuxt-plenty/payment-logos/vorkasse.svg',
  },
  6044: { title: 'Google Pay', description: 'Bezahlen Sie bequem mit Google Pay.' },
  6045: { title: 'Apple Pay (PayPal)', description: '' },
  6020: { title: 'Lastschrift', description: 'Bezahlen Sie bequem per Lastschrift.' },
  6078: { title: 'Sofortüberweisung', description: 'Bezahlen Sie bequem direkt über Ihr Online-Banking.' },
};

// Explicit list: Object.keys would return the numeric ids in ascending order, not in the order above.
const ORDER = [6033, 6001, 6059, 6074, 6057, 6044, 6045, 6020, 6078];

export const getArizonaPaymentDisplay = (method: PaymentMethod) => {
  const display = ARIZONA_PAYMENT_DISPLAY[method.id];
  return {
    title: display?.title ?? method.name,
    description: display?.description ?? '',
    logo: display?.logo ?? method.icon,
  };
};

export const sortArizonaPaymentMethods = (methods: PaymentMethod[]): PaymentMethod[] => {
  const rank = (id: number) => {
    const index = ORDER.indexOf(id);
    return index === -1 ? ORDER.length : index;
  };
  return [...methods].sort((a, b) => rank(a.id) - rank(b.id));
};
