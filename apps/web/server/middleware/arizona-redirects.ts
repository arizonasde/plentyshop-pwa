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
  '/versandkosten': '/service#versand',
  // Die Versand-Infos stehen auf der Service-Seite; /shipping (Fußzeile, „zzgl. Versandkosten“) hat keinen eigenen Text.
  '/shipping': '/service#versand',
  '/zahlungsarten': '/service',
  '/zahlungsarten2': '/service',
  '/hilfe': '/service',
  '/retoure': '/service',
  '/sizecharts': '/service',
  '/black-friday': '/sale-und-outlet',
  '/sold': '/',
  '/artikel-nicht-gefunden': '/',
  '/startseite': '/',
  '/newsletter/newsletter-abmelden': '/newsletter/unsubscribe',
};

export default defineEventHandler((event) => {
  const [rawPath = '/', query] = (event.path ?? '/').split('?');
  const path = rawPath.replace(/\/+$/, '').toLowerCase().replace(/^\/arizona2017-test(?=\/)/, '');
  const localeShipping = path.match(/^\/(fr|it|es|nl|pl)\/shipping$/);
  if (localeShipping) return sendRedirect(event, `/${localeShipping[1]}/service#versand`, 301);
  const target = REDIRECTS[path] ?? (rawPath.toLowerCase().startsWith('/arizona2017-test') ? '/' : undefined);
  if (!target) return;
  const [targetPath, hash] = target.split('#');
  return sendRedirect(event, `${targetPath}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`, 301);
});
