// Google Analytics 4. Tracking runs on the production deployment only, so
// local development and preview deployments don't skew the statistics, and
// only after the visitor accepts it in the cookie banner.
export const GA_MEASUREMENT_ID = 'G-EX5B8WC8DJ'

export const analyticsEnabled = process.env.VERCEL_ENV === 'production'

// Hosts gtag.js loads from and reports to (Google's CSP guidance for GA4).
export const analyticsHosts = analyticsEnabled
  ? ' https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com'
  : ''
