// Visitor's analytics consent, kept in localStorage. Storage can be
// unavailable (private mode, blocked site data), so every access is guarded;
// without storage there is no decision and analytics stays off.

export type ConsentDecision = 'granted' | 'denied'

const STORAGE_KEY = 'presentiq-consent'

// Fired on window when the decision changes, so the analytics loader reacts
// without a reload.
export const CONSENT_CHANGE_EVENT = 'presentiq:consent-change'
// Fired by the footer button to reopen the banner.
export const CONSENT_OPEN_EVENT = 'presentiq:consent-open'

export function readConsent(): ConsentDecision | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

// Returns false when the decision could not be stored.
export function writeConsent(decision: ConsentDecision): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, decision)
  } catch {
    return false
  }
  window.dispatchEvent(new CustomEvent<ConsentDecision>(CONSENT_CHANGE_EVENT, { detail: decision }))
  return true
}

export function openConsentBanner() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))
}
