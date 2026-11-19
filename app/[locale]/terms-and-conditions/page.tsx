import { notFound } from 'next/navigation'
import Heading from '@/src/components/atoms/Heading'
import RichText from '@/src/components/atoms/RichText'
import Reveal from '@/src/components/atoms/Reveal'
import CharReveal from '@/src/components/atoms/CharReveal'
import { hyphenate } from '@/src/lib/hyphenate'
import Section from '@/src/components/atoms/Section'
import { getTermsAndConditions } from '@/sanity/lib/fetch'
import { buildMetadata, resolveSeoText } from '@/src/lib/pageMetadata'
import type { Metadata } from 'next'
import { resolveLocale } from '@/src/lib/locale'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const l = locale as 'en' | 'de'
  const data = await getTermsAndConditions()
  const t = (field: any) => resolveLocale(field, l)
  const fallbackHeading = l === 'de' ? 'Allgemeine Geschäftsbedingungen' : 'Terms and Conditions'
  const seo = resolveSeoText(
    data?.seo,
    l,
    t(data?.heading) || fallbackHeading,
    // Fallback summary for search results when Sanity has none.
    l === 'de'
      ? 'Allgemeine Geschäftsbedingungen (AGB) der Presentiq GmbH.'
      : 'General terms and conditions of Presentiq GmbH.'
  )

  return buildMetadata({
    locale: l,
    path: '/terms-and-conditions',
    title: seo.title,
    description: seo.description,
    image: seo.image,
  })
}

export default async function TermsAndConditionsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const data = await getTermsAndConditions()

  const body = data?.body?.[locale as 'en' | 'de'] || data?.body?.de || data?.body?.en
  // The page goes live only once the terms are entered in Sanity.
  if (!body?.length) notFound()

  const t = (field: any) => resolveLocale(field, locale as 'en' | 'de')
  const heading =
    t(data?.heading) || (locale === 'de' ? 'Allgemeine Geschäftsbedingungen' : 'Terms and Conditions')

  return (
    <main className="bg-primary-dark">
      <Section>
        <div className="max-w-225 py-12">
          <Heading
            level="h1"
            text={heading}
            className="text-h2! md:text-h2-md! lg:text-h2-lg! font-extrabold! text-white! mb-16"
          >
            <CharReveal text={hyphenate(heading, locale as 'en' | 'de')} />
          </Heading>
          <Reveal delay={200}>
            <RichText value={body} color="primary" />
          </Reveal>
        </div>
      </Section>
    </main>
  )
}
