/**
 * Arizona: permanent redirects from the content pages of the old shop (Ceres) to the pages of this shop,
 * so links and search rankings of the old addresses keep working instead of showing an empty category.
 */
const REDIRECTS: Record<string, string> = {
  '/impressum': '/legal-disclosure',
  '/agb': '/terms-and-conditions',
  '/gtc': '/terms-and-conditions',
  '/datenschutz': '/privacy-policy',
  '/widerrufsrecht': '/cancellation-rights',
  '/kontakt': '/contact',
  '/versandkosten': '/shipping',
  '/zahlungsarten': '/service',
  '/zahlungsarten2': '/service',
  '/hilfe': '/service',
  '/retoure': '/service',
  '/sizecharts': '/service',
  '/black-friday': '/sale-und-outlet',
  '/sold': '/',
  '/artikel-nicht-gefunden': '/',
};

export default defineEventHandler((event) => {
  const [rawPath = '/', query] = (event.path ?? '/').split('?');
  const path = rawPath.replace(/\/+$/, '').toLowerCase().replace(/^\/arizona2017-test(?=\/)/, '');
  const target = REDIRECTS[path] ?? (rawPath.toLowerCase().startsWith('/arizona2017-test') ? '/' : undefined);
  if (!target) return;
  return sendRedirect(event, query ? `${target}?${query}` : target, 301);
});
