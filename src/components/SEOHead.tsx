import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  url?: string
  image?: string
  type?: string
}

const SITE_URL = 'https://profit-plus-beta.vercel.app'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

const DEFAULT_TITLE =
  'ProfitPlus | Growth & Performance Marketing for Startups'

const DEFAULT_DESCRIPTION =
  'ProfitPlus helps early-stage startups test acquisition channels, improve conversion, and build a repeatable path from first click to revenue.'

const DEFAULT_KEYWORDS =
  'growth marketing startup, performance marketing startup, startup marketing agency india, growth strategy india, paid acquisition startup, startup funnel optimization'

export default function SEOHead({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  url = SITE_URL,
  image = DEFAULT_IMAGE,
  type = 'website',
}: SEOProps) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ProfitPlus',
    description:
      'Growth and performance marketing for early-stage startups.',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    email: 'profitplus025@gmail.com',
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ProfitPlus',
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
  }

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="ProfitPlus" />
      <meta
        name="robots"
        content="index, follow, max-image-preview:large"
      />
      <meta name="googlebot" content="index, follow" />

      <link rel="canonical" href={url} />

      {/* Mobile */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <meta name="theme-color" content="#10b981" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta
        name="apple-mobile-web-app-title"
        content="ProfitPlus"
      />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="ProfitPlus" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Schema */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  )
}