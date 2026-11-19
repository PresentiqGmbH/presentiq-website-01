export default {
  name: 'termsAndConditions',
  title: 'Terms and Conditions Page (AGB)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title (used to pick this page in Navigation/Footer)',
      type: 'string',
      initialValue: 'Terms and Conditions',
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title' },
      // Must match the route folder app/[locale]/terms-and-conditions.
      initialValue: { _type: 'slug', current: 'terms-and-conditions' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heading',
      title: 'Page Heading (visible on the page, EN/DE)',
      type: 'localeString',
    },
    {
      name: 'body',
      title: 'Content',
      type: 'localeRichText',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
}
