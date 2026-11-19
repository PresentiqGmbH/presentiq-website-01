'use client'

import { useEffect } from 'react'
import { CONSENT_CHANGE_EVENT, readConsent, type ConsentDecision } from '@/src/lib/consent'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

interface GoogleAnalyticsProps {
  measurementId: string
  enabled: boolean
}

// Loads gtag.js only once the visitor has granted consent; before that no
// request reaches Google. The script is injected from this (nonce-trusted)
// bundle, which the CSP's 'strict-dynamic' allows.
export default function GoogleAnalytics({ measurementId, enabled }: GoogleAnalyticsProps) {
  useEffect(() => {
    if (!enabled) return
    // gtag.js honours window['ga-disable-<id>'] as an opt-out switch.
    const optOut = (value: boolean) => {
      (window as unknown as Record<string, boolean>)[`ga-disable-${measurementId}`] = value
    }

    const load = () => {
      optOut(false)
      if (window.gtag) return
      window.dataLayer = window.dataLayer || []
      // gtag.js reads the arguments object, not an array, from dataLayer.
      window.gtag = function gtag() {
        window.dataLayer!.push(arguments)
      }
      window.gtag('js', new Date())
      window.gtag('config', measurementId)

      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
      document.head.appendChild(script)
    }

    // Withdrawn consent: stop further hits for the rest of this page view
    // and remove the GA cookies already set.
    const stop = () => {
      optOut(true)
      const domain = window.location.hostname.replace(/^www\./, '')
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.split('=')[0].trim()
        if (!name.startsWith('_ga')) continue
        for (const d of ['', `; domain=${domain}`, `; domain=.${domain}`]) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`
        }
      }
    }

    if (readConsent() === 'granted') load()

    const onChange = (event: Event) => {
      const decision = (event as CustomEvent<ConsentDecision>).detail
      if (decision === 'granted') load()
      else stop()
    }
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange)
  }, [enabled, measurementId])

  return null
}
