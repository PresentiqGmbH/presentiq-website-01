'use client'

import { openConsentBanner } from '@/src/lib/consent'

interface CookieSettingsButtonProps {
  label: string
  className?: string
}

// Reopens the cookie banner so visitors can change their choice.
export default function CookieSettingsButton({ label, className = '' }: CookieSettingsButtonProps) {
  return (
    <button type="button" onClick={openConsentBanner} className={className}>
      {label}
    </button>
  )
}
