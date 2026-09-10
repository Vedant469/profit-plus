import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, ArrowDown, Search, Sparkles } from 'lucide-react'
import { blogPosts } from '../data/mockData'
import SEOHead from '../components/SEOHead'

const fallbackCategories = [
  'All',
  'Case Study',
  'Performance Marketing',
  'SEO',
  'Email Marketing',
  'Analytics',
]

const categoryColors: Record<string, string> = {
  'Case Study': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Performance Marketing': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'SEO': 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  'Email Marketing': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  'Analytics': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
}

const defaultCategoryStyle = 'text-gray-300 bg-white/5 border-white/10'

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const categories = useMemo(() => {
    const discovered = Array.from(new Set(blogPosts.map((post) => post.category).filter(Boolean)))
    const ordered = fallbackCategories.filter((category) => category === 'All' || discovered.includes(category))
    const additional = discovered.filter((category) => !ordered.includes(category))
    return [...ordered, ...additional]
  }, [])

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase()

    return blogPosts.filter((post) => {
      const matchCategory = activeCategory === 'All' || post.category === activeCategory
      const searchable = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase()
      return matchCategory && (!query || searchable.includes(query))
    })
  }, [activeCategory, search])

  const featured = blogPosts[0]

  return (
    <div className="pt-24">
      <SEOHead
        title="Startup Growth Insights | ProfitPlus"
        description="Practical growth, acquisition, SEO, lifecycle, and analytics ideas for startup teams. Built around clear experiments, useful measurement, and decisions you can act on."
        keywords="startup growth strategy, performance marketing for startups, startup acquisition, growth experiments, marketing analytics"
        url="https://profit-plus-beta.vercel.app/blog"
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div
          className="absolute top-0 right-0 h-96 w-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(139,92,246,0.08)' }}
        />
        <div
          className="absolute bottom-0 left-0 h-72 w-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(0,255,136,0.05)' }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-5"
              style={{
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.2)',
                color: '#a78bfa',
              }}
            >
              <Sparkles className="w-4 h-4" />
              Startup Growth Library
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Better growth decisions.
              <span className="block gradient-text">Less marketing noise.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Practical ideas on acquisition, SEO, lifecycle, and analytics for teams that need to
              learn quickly and spend carefully.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(139,92,246,0.15)',
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative min-h-72 lg:min-h-full overflow-hidden">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${featured.color} opacity-45`} />
                  <div
                    className="absolute top-5 left-5 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: '#00ff88', color: '#020617' }}
                  >
                    Featured insight
                  </div>
                </div>

                <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                  <span
                    className={`inline-flex w-fit px-2.5 py-1 rounded-full text-xs font-medium border mb-4 ${
                      categoryColors[featured.category] ?? defaultCategoryStyle
                    }`}
                  >
                    {featured.category}
                  </span>

                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                    {featured.title}
                  </h2>

                  <p className="text-gray-400 leading-relaxed mb-6">
                    {featured.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {featured.readTime}
                    </span>
                    <span>{featured.date}</span>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>
        </section>
      )}

      {/* Filters */}
      <section id="article-library" className="pb-8 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = activeCategory === category

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: isActive
                        ? 'rgba(139,92,246,0.2)'
                        : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${
                        isActive
                          ? 'rgba(139,92,246,0.5)'
                          : 'rgba(255,255,255,0.08)'
                      }`,
                      color: isActive ? '#a78bfa' : '#9ca3af',
                    }}
                    aria-pressed={isActive}
                  >
                    {category}
                  </button>
                )
              })}
            </div>

            <div
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 w-full lg:w-72"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(139,92,246,0.15)',
              }}
            >
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="search"
                placeholder="Search the library..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
                aria-label="Search articles"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Library */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.16em] text-gray-500">Article library</p>
              <p className="text-gray-400 mt-1">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch('')
                setActiveCategory('All')
              }}
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Reset filters
            </button>
          </div>

          {filteredPosts.length === 0 ? (
            <div
              className="text-center py-16 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p className="text-white font-semibold mb-2">No matching articles.</p>
              <p className="text-gray-500 text-sm">
                Try another keyword or clear the filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="group overflow-hidden rounded-2xl transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(139,92,246,0.1)',
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.borderColor = 'rgba(139,92,246,0.1)'
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${post.color} opacity-35`} />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          categoryColors[post.category] ?? defaultCategoryStyle
                        }`}
                      >
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-xs">{post.date}</span>
                    </div>

                    <h3 className="text-white font-bold text-lg mb-2 leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/5 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div
            className="rounded-3xl p-8 md:p-12 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(0,255,136,0.08), rgba(139,92,246,0.08))',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <ArrowDown className="w-5 h-5 mx-auto mb-4 text-gray-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Need the thinking applied to your funnel?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
              Start with a focused growth audit and leave with a clearer next experiment, not a
              giant marketing checklist.
            </p>
            <a href="/contact" className="btn-green-pill">
              Get a Growth Audit
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
