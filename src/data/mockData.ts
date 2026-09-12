// -----------------------------------------------------------------------------
// ProfitPlus shared content
// -----------------------------------------------------------------------------
// IMPORTANT:
// This file contains public-facing content and clearly labelled demo/illustrative
// data used by pages that have not yet been migrated to live Supabase data.
//
// Never present the demo datasets below as verified client results.
// Live client/account data belongs in Supabase.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public positioning
// -----------------------------------------------------------------------------

export const stats = [
  { value: 3, suffix: '', label: 'Core Acquisition Channels' },
  { value: 90, suffix: 'd', label: 'Experiment Cycle' },
  { value: 6, suffix: '', label: 'Growth Levers' },
  { value: 1, suffix: '', label: 'Shared Source of Truth' },
]

export const services = [
  {
    id: 1,
    title: 'Performance Marketing',
    description:
      'Paid acquisition strategy across Google, Meta, LinkedIn, and other high-intent channels.',
    features: [
      'Google Ads',
      'Meta Ads',
      'LinkedIn Ads',
      'Campaign Testing',
    ],
    color: 'blue',
  },
  {
    id: 2,
    title: 'SEO & Content Strategy',
    description:
      'Search strategy built around customer intent, technical foundations, and content that supports acquisition.',
    features: [
      'Technical SEO',
      'Content Strategy',
      'Keyword Research',
      'Content Systems',
    ],
    color: 'violet',
  },
  {
    id: 3,
    title: 'Positioning & Brand',
    description:
      'Sharper messaging and positioning so early-stage products are easier to understand and easier to choose.',
    features: [
      'Positioning',
      'Messaging',
      'Offer Design',
      'Brand Guidelines',
    ],
    color: 'emerald',
  },
  {
    id: 4,
    title: 'Analytics & Insights',
    description:
      'Simple reporting systems that connect acquisition activity to pipeline, revenue, and payback.',
    features: [
      'Dashboard Setup',
      'Funnel Tracking',
      'Attribution',
      'Experiment Analysis',
    ],
    color: 'amber',
  },
  {
    id: 5,
    title: 'Social & Distribution',
    description:
      'Focused organic distribution systems for founders and teams that need repeatable demand generation.',
    features: [
      'Content Planning',
      'Distribution',
      'Community',
      'Social Strategy',
    ],
    color: 'pink',
  },
  {
    id: 6,
    title: 'Lifecycle & Email',
    description:
      'Lifecycle messaging that improves activation, nurture, retention, and repeat revenue.',
    features: [
      'Campaign Design',
      'Automation',
      'Segmentation',
      'A/B Testing',
    ],
    color: 'cyan',
  },
]

// -----------------------------------------------------------------------------
// Illustrative portfolio examples
// -----------------------------------------------------------------------------
// These are frameworks/examples only.
// They are NOT customer case studies and contain NO claimed client results.

export const caseStudies = [
  {
    id: 1,
    client: 'Illustrative SaaS Startup',
    industry: 'B2B SaaS',
    title: 'From scattered experiments to a focused acquisition plan',
    description:
      'An example engagement showing how a startup could prioritize one high-intent channel before expanding spend.',
    metrics: [
      { label: 'Primary Goal', value: 'Lower CAC' },
      { label: 'Focus', value: '1 Channel' },
      { label: 'Cycle', value: '90 Days' },
    ],
    image:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80',
    tags: ['B2B SaaS', 'Paid Acquisition', 'Illustrative'],
    gradient: 'from-blue-600 to-violet-600',
  },
  {
    id: 2,
    client: 'Illustrative D2C Startup',
    industry: 'D2C',
    title: 'Building a repeatable creative testing system',
    description:
      'An example workflow for testing offers, audiences, and creative before increasing media spend.',
    metrics: [
      { label: 'Primary Goal', value: 'Improve ROAS' },
      { label: 'Focus', value: 'Creative Testing' },
      { label: 'Cycle', value: '6–8 Weeks' },
    ],
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
    tags: ['D2C', 'Meta Ads', 'Illustrative'],
    gradient: 'from-emerald-600 to-cyan-600',
  },
  {
    id: 3,
    client: 'Illustrative Fintech Startup',
    industry: 'Fintech',
    title: 'Turning search intent into a measurable content engine',
    description:
      'An example SEO program focused on high-intent queries, conversion paths, and durable organic acquisition.',
    metrics: [
      { label: 'Primary Goal', value: 'Qualified Leads' },
      { label: 'Focus', value: 'Search Intent' },
      { label: 'Cycle', value: '3–6 Months' },
    ],
    image:
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
    tags: ['Fintech', 'SEO', 'Illustrative'],
    gradient: 'from-emerald-500 to-orange-600',
  },
  {
    id: 4,
    client: 'Illustrative AI Startup',
    industry: 'AI / Developer Tools',
    title: 'Designing a measurable founder-led growth loop',
    description:
      'An example growth system connecting content, outbound, landing pages, and analytics around one target segment.',
    metrics: [
      { label: 'Primary Goal', value: 'Qualified Pipeline' },
      { label: 'Focus', value: 'Founder-Led' },
      { label: 'Cycle', value: '8–12 Weeks' },
    ],
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
    tags: ['AI', 'Lead Gen', 'Illustrative'],
    gradient: 'from-rose-500 to-pink-600',
  },
]

// -----------------------------------------------------------------------------
// Testimonials
// -----------------------------------------------------------------------------
// No fabricated customer testimonials.
// Real testimonials should only be added after obtaining permission from a client.

export const testimonials: never[] = []

// -----------------------------------------------------------------------------
// Capability groups
// -----------------------------------------------------------------------------
// These are capabilities, not named employees or fabricated team biographies.

export const team = [
  {
    id: 1,
    name: 'Growth Strategy',
    role: 'Capability',
    bio: 'Acquisition strategy, positioning, and experiment planning for startup teams.',
    avatar:
      'https://ui-avatars.com/api/?name=Growth+Strategy&background=10b981&color=fff',
  },
  {
    id: 2,
    name: 'Performance Marketing',
    role: 'Capability',
    bio: 'Paid acquisition testing across search and social channels with a focus on unit economics.',
    avatar:
      'https://ui-avatars.com/api/?name=Performance+Marketing&background=10b981&color=fff',
  },
  {
    id: 3,
    name: 'Creative & Content',
    role: 'Capability',
    bio: 'Messaging, landing pages, creative testing, and content systems built around customer intent.',
    avatar:
      'https://ui-avatars.com/api/?name=Creative+Content&background=10b981&color=fff',
  },
  {
    id: 4,
    name: 'Analytics & Systems',
    role: 'Capability',
    bio: 'Measurement, reporting, funnel analysis, and decision systems grounded in data.',
    avatar:
      'https://ui-avatars.com/api/?name=Analytics+Systems&background=10b981&color=fff',
  },
]

// -----------------------------------------------------------------------------
// DEMO dashboard data
// -----------------------------------------------------------------------------
// Temporary only.
// Dashboard/Campaigns/Analytics/Reports are being migrated to live Supabase data.
// Do not present these numbers as client results.

export const campaignData = [
  {
    id: 'D001',
    name: 'Demo — Search Intent Validation',
    client: 'Illustrative SaaS',
    status: 'active',
    budget: 3000,
    spent: 2140,
    impressions: 52000,
    clicks: 1840,
    conversions: 74,
    roas: 2.6,
    channel: 'Google Ads',
    startDate: '2026-08-01',
    endDate: '2026-09-30',
  },
  {
    id: 'D002',
    name: 'Demo — Creative Test Sprint',
    client: 'Illustrative D2C',
    status: 'active',
    budget: 2500,
    spent: 1680,
    impressions: 118000,
    clicks: 2960,
    conversions: 96,
    roas: 3.1,
    channel: 'Meta Ads',
    startDate: '2026-08-15',
    endDate: '2026-09-30',
  },
  {
    id: 'D003',
    name: 'Demo — Founder-Led Content Test',
    client: 'Illustrative AI Startup',
    status: 'active',
    budget: 1200,
    spent: 640,
    impressions: 21000,
    clicks: 910,
    conversions: 38,
    roas: 2.2,
    channel: 'Content',
    startDate: '2026-09-01',
    endDate: '2026-10-15',
  },
  {
    id: 'D004',
    name: 'Demo — High-Intent Landing Page Test',
    client: 'Illustrative Fintech',
    status: 'paused',
    budget: 1800,
    spent: 980,
    impressions: 34000,
    clicks: 1200,
    conversions: 52,
    roas: 2.8,
    channel: 'SEO',
    startDate: '2026-07-15',
    endDate: '2026-09-15',
  },
]

// -----------------------------------------------------------------------------
// DEMO analytics data
// -----------------------------------------------------------------------------
// Temporary compatibility exports.
// These should disappear once AnalyticsPage is fully Supabase-driven.

export const monthlyPerformance = [
  {
    month: 'Apr',
    impressions: 42000,
    clicks: 1480,
    conversions: 48,
    spend: 4200,
    revenue: 9600,
  },
  {
    month: 'May',
    impressions: 56000,
    clicks: 1920,
    conversions: 61,
    spend: 5000,
    revenue: 12200,
  },
  {
    month: 'Jun',
    impressions: 68000,
    clicks: 2360,
    conversions: 74,
    spend: 5700,
    revenue: 14500,
  },
  {
    month: 'Jul',
    impressions: 82000,
    clicks: 2840,
    conversions: 88,
    spend: 6400,
    revenue: 17100,
  },
  {
    month: 'Aug',
    impressions: 104000,
    clicks: 3380,
    conversions: 102,
    spend: 7200,
    revenue: 19800,
  },
  {
    month: 'Sep',
    impressions: 126000,
    clicks: 3920,
    conversions: 118,
    spend: 8100,
    revenue: 22400,
  },
]

export const channelBreakdown = [
  { channel: 'Google Ads', spend: 3100, revenue: 8600, roas: 2.8 },
  { channel: 'Meta Ads', spend: 2700, revenue: 8100, roas: 3.0 },
  { channel: 'LinkedIn', spend: 1400, revenue: 3200, roas: 2.3 },
  { channel: 'SEO', spend: 1200, revenue: 4100, roas: 3.4 },
  { channel: 'Email', spend: 650, revenue: 2400, roas: 3.7 },
  { channel: 'Content', spend: 800, revenue: 1900, roas: 2.4 },
]

export const kpiSummary = [
  {
    label: 'Illustrative Ad Spend',
    value: '$9.85K',
    change: 'Demo',
    trend: 'up',
  },
  {
    label: 'Illustrative Revenue',
    value: '$28.3K',
    change: 'Demo',
    trend: 'up',
  },
  {
    label: 'Illustrative ROAS',
    value: '2.87x',
    change: 'Demo',
    trend: 'up',
  },
  {
    label: 'Illustrative Experiments',
    value: '3',
    change: 'Demo',
    trend: 'up',
  },
]

// -----------------------------------------------------------------------------
// DEMO reports
// -----------------------------------------------------------------------------
// Temporary compatibility data.
// Real reports will come from Supabase.

export const reports = [
  {
    id: 'R001',
    title: 'Demo — Acquisition Experiment Summary',
    client: 'Illustrative SaaS',
    type: 'Experiment Report',
    date: '2026-09-01',
    size: 'Demo',
    status: 'ready',
  },
  {
    id: 'R002',
    title: 'Demo — Creative Testing Review',
    client: 'Illustrative D2C',
    type: 'Campaign Report',
    date: '2026-08-28',
    size: 'Demo',
    status: 'ready',
  },
  {
    id: 'R003',
    title: 'Demo — Search Intent Audit',
    client: 'Illustrative Fintech',
    type: 'Audit Report',
    date: '2026-08-22',
    size: 'Demo',
    status: 'ready',
  },
  {
    id: 'R004',
    title: 'Demo — Founder-Led Growth Plan',
    client: 'Illustrative AI Startup',
    type: 'Strategy Report',
    date: '2026-09-05',
    size: 'Demo',
    status: 'ready',
  },
]

// -----------------------------------------------------------------------------
// Content library
// -----------------------------------------------------------------------------
// These are educational article concepts/content entries.
// They are not presented as customer proof.

export const blogPosts = [
  {
    id: 1,
    title: 'The First 3 Acquisition Channels We’d Test With a $3K Monthly Budget',
    excerpt:
      'A practical framework for deciding what to test first when a startup has limited budget, limited data, and no room for wasted experiments.',
    category: 'Performance Marketing',
    author: 'Profit Plus',
    date: 'September 2026',
    readTime: '8 min read',
    image:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80',
    color: 'from-blue-600 to-violet-600',
    slug: 'first-3-acquisition-channels',
  },
  {
    id: 2,
    title: 'CAC vs. Payback Period: The Startup Metrics That Actually Matter',
    excerpt:
      'Why a cheap lead is not necessarily a good lead, and how founders can connect acquisition cost to cash recovery.',
    category: 'Analytics',
    author: 'Profit Plus',
    date: 'August 2026',
    readTime: '7 min read',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    color: 'from-emerald-500 to-cyan-600',
    slug: 'cac-vs-payback-period',
  },
  {
    id: 3,
    title: 'When Should a Startup Stop Testing and Start Scaling a Channel?',
    excerpt:
      'A decision framework for moving from exploration to scale without confusing a lucky spike with repeatable acquisition.',
    category: 'Growth Strategy',
    author: 'Profit Plus',
    date: 'August 2026',
    readTime: '9 min read',
    image:
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&q=80',
    color: 'from-amber-500 to-orange-600',
    slug: 'when-to-scale-a-channel',
  },
  {
    id: 4,
    title: 'How to Build a Marketing Dashboard That Actually Drives Decisions',
    excerpt:
      'A practical guide to replacing vanity metrics with a small set of numbers your growth team can act on each week.',
    category: 'Analytics',
    author: 'Profit Plus',
    date: 'July 2026',
    readTime: '6 min read',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    color: 'from-violet-600 to-purple-600',
    slug: 'marketing-dashboard-decisions',
  },
  {
    id: 5,
    title: 'What a Startup Should Measure Before Increasing Ad Spend',
    excerpt:
      'Before turning up the budget, check the funnel: tracking, conversion quality, payback, and whether the offer can absorb more demand.',
    category: 'Performance Marketing',
    author: 'Profit Plus',
    date: 'July 2026',
    readTime: '6 min read',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
    color: 'from-rose-500 to-pink-600',
    slug: 'before-increasing-ad-spend',
  },
  {
    id: 6,
    title: 'Attribution for Early-Stage Startups: Keep It Simple Until the Data Catches Up',
    excerpt:
      'A lightweight attribution framework for teams that need useful decisions before they have enough volume for a complex modelling stack.',
    category: 'Analytics',
    author: 'Profit Plus',
    date: 'June 2026',
    readTime: '10 min read',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
    color: 'from-cyan-600 to-blue-600',
    slug: 'simple-startup-attribution',
  },
]