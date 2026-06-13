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

export default function SEOHead({
  title = 'ProfitPlus | #1 Performance Marketing Agency Pune & India',
  description = "India's most profit-driven marketing agency based in Pune. We build data-driven campaigns delivering 320%+ average ROI for businesses across India and globally.",
  keywords = 'marketing agency pune, marketing agency india, performance marketing pune, digital marketing agency india, ROI marketing agency, profit driven marketing, best marketing agency pune, top digital marketing company india',
  url = SITE_URL,
  image = DEFAULT_IMAGE,
  type = 'website',
}: SEOProps) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ProfitPlus',
    description: "India's most profit-driven marketing agency",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    foundingDate: '2012',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'PARSVNATH PRATISHTHA, Nakshtra Commercial St, Vitthal Nagar',
      addressLocality: 'Chinchwad, Pimpri-Chinchwad',
      addressRegion: 'Maharashtra',
      postalCode: '411019',
      addressCountry: 'IN',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-77965-97171',
        contactType: 'sales',
        areaServed: ['IN', 'US', 'GB', 'AU', 'CA', 'SG'],
        availableLanguage: 'English',
      },
    ],
    email: 'profitplus025@gmail.com',
    areaServed: ['India', 'Global'],
    serviceArea: {
      '@type': 'Place',
      name: 'Worldwide',
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ProfitPlus',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <Helmet>
      {/* ── Basic ──────────────────────────────────────────── */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="ProfitPlus" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* ── Mobile ─────────────────────────────────────────── */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#10b981" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="ProfitPlus" />

      {/* ── Open Graph ─────────────────────────────────────── */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="ProfitPlus" />
      <meta property="og:locale" content="en_IN" />

      {/* ── Twitter Card ───────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@ProfitPlus" />

      {/* ── Geo targeting ──────────────────────────────────── */}
      <meta name="geo.region" content="IN-MH" />
      <meta name="geo.placename" content="Pune, Maharashtra, India" />
      <meta name="geo.position" content="18.6279;73.7997" />
      <meta name="ICBM" content="18.6279, 73.7997" />

      {/* ── Schema markup ──────────────────────────────────── */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  )
}