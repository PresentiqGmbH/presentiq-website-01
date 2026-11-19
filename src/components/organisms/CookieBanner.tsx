'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CONSENT_OPEN_EVENT, readConsent, writeConsent, type ConsentDecision } from '@/src/lib/consent'

const COPY = {
  de: {
    label: 'Cookie-Einstellungen',
    text: 'Wir verwenden notwendige Cookies für den Betrieb der Website und – mit Ihrer Einwilligung – Google Analytics, um zu verstehen, wie die Website genutzt wird.',
    privacy: 'Datenschutzerklärung',
    accept: 'Akzeptieren',
    decline: 'Ablehnen',
    settings: 'Einstellungen',
    close: 'Schließen',
    necessary: 'Notwendig',
    necessaryNote: 'Immer aktiv',
    statistics: 'Statistik (Google Analytics)',
    save: 'Auswahl speichern',
    back: 'Zurück',
  },
  en: {
    label: 'Cookie settings',
    text: 'We use necessary cookies to run this website and, with your consent, Google Analytics to understand how the site is used.',
    privacy: 'Privacy policy',
    accept: 'Accept',
    decline: 'Decline',
    settings: 'Settings',
    close: 'Close',
    necessary: 'Necessary',
    necessaryNote: 'Always active',
    statistics: 'Statistics (Google Analytics)',
    save: 'Save selection',
    back: 'Back',
  },
} as const

const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue'
// Accept and Decline share one style so neither choice is visually favoured.
const CHOICE_BUTTON = `flex-1 rounded-full border-2 border-white px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-primary-dark ${FOCUS_RING}`
const TEXT_BUTTON = `text-sm text-white/70 underline underline-offset-2 hover:text-white ${FOCUS_RING}`

// Non-modal consent card: fixed to the viewport (no layout shift), no
// backdrop, the page stays scrollable and clickable behind it.
export default function CookieBanner({ locale }: { locale: 'en' | 'de' }) {
  const copy = COPY[locale]
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'main' | 'settings'>('main')
  const [statistics, setStatistics] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const focusOnOpen = useRef(false)

  // Storage is read after mount so server and client render the same markup.
  useEffect(() => {
    if (readConsent() === null) setOpen(true)

    const reopen = () => {
      setStatistics(readConsent() === 'granted')
      setView('main')
      focusOnOpen.current = true
      setOpen(true)
    }
    window.addEventListener(CONSENT_OPEN_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen)
  }, [])

  // Opened on request (footer button): move focus into the card. On a first
  // visit focus stays where it is, since the card doesn't block the page.
  useEffect(() => {
    if (open && focusOnOpen.current) {
      focusOnOpen.current = false
      dialogRef.current?.focus()
    }
  }, [open])

  const decide = useCallback((decision: ConsentDecision) => {
    writeConsent(decision)
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') decide('denied')
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, decide])

  if (!open) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="false"
      aria-label={copy.label}
      tabIndex={-1}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/20 bg-primary-dark p-5 text-white shadow-2xl outline-none sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[24rem] sm:rounded-2xl sm:border"
    >
      <button
        type="button"
        onClick={() => decide('denied')}
        aria-label={copy.close}
        className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:text-white ${FOCUS_RING}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {view === 'main' ? (
        <>
          <p className="pr-8 text-sm leading-relaxed text-white/90">
            {copy.text}{' '}
            <Link href={`/${locale}/privacy-policy`} className={`underline underline-offset-2 hover:text-white ${FOCUS_RING}`}>
              {copy.privacy}
            </Link>
          </p>
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={() => decide('granted')} className={CHOICE_BUTTON}>
              {copy.accept}
            </button>
            <button type="button" onClick={() => decide('denied')} className={CHOICE_BUTTON}>
              {copy.decline}
            </button>
          </div>
          <button type="button" onClick={() => setView('settings')} className={`mt-3 ${TEXT_BUTTON}`}>
            {copy.settings}
          </button>
        </>
      ) : (
        <>
          <p className="pr-8 font-display text-base font-bold">{copy.settings}</p>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex items-center justify-between gap-4">
              <span>{copy.necessary}</span>
              <span className="text-white/60">{copy.necessaryNote}</span>
            </li>
            <li className="flex items-center justify-between gap-4">
              <span id="consent-statistics">{copy.statistics}</span>
              <button
                type="button"
                role="switch"
                aria-checked={statistics}
                aria-labelledby="consent-statistics"
                onClick={() => setStatistics((value) => !value)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${statistics ? 'bg-primary-blue' : 'bg-white/30'} ${FOCUS_RING}`}
              >
                <span
                  className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${statistics ? 'translate-x-5' : ''}`}
                />
              </button>
            </li>
          </ul>
          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={() => decide(statistics ? 'granted' : 'denied')}
              className={CHOICE_BUTTON}
            >
              {copy.save}
            </button>
            <button type="button" onClick={() => setView('main')} className={TEXT_BUTTON}>
              {copy.back}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
