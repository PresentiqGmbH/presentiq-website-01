// Google Analytics 4. Tracking runs on the production deployment only, so
// local development and preview deployments don't skew the statistics.
export const GA_MEASUREMENT_ID = 'G-EX5B8WC8DJ'

export const analyticsEnabled = process.env.VERCEL_ENV === 'production'

// Hosts gtag.js loads from and reports to (Google's CSP guidance for GA4).
export const analyticsHosts = analyticsEnabled
  ? ' https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com'
  : ''

// Google Consent Mode v2: everything is denied until the visitor agrees in
// the cookie banner, which then sends a consent update. Until then GA sets
// no cookies and only receives anonymous, cookieless pings. Must run before
// the banner and before gtag.js.
export const consentDefaultScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');
`
