import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Target,
  Trash2,
  X,
  Zap,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

type CampaignStatus = 'active' | 'paused' | 'completed'

type Campaign = {
  id: string
  name: string
  client: string
  status: CampaignStatus | string
  budget: number | string
  spent: number | string
  impressions: number | string
  clicks: number | string
  conversions: number | string
  roas: number | string
  channel: string
  start_date: string | null
  end_date: string | null
  client_id: string
}

type Client = {
  id: string
  name: string
  company: string | null
}

type CampaignForm = {
  name: string
  channel: string
  status: CampaignStatus
  budget: string
  spent: string
  impressions: string
  clicks: string
  conversions: string
  roas: string
  start_date: string
  end_date: string
}

const CHANNELS = [
  'Google Ads',
  'Meta Ads',
  'LinkedIn Ads',
  'YouTube',
  'SEO',
  'Email',
  'Programmatic',
  'Other',
]

const STATUS_OPTIONS: CampaignStatus[] = ['active', 'paused', 'completed']

const EMPTY_FORM: CampaignForm = {
  name: '',
  channel: 'Google Ads',
  status: 'active',
  budget: '',
  spent: '',
  impressions: '',
  clicks: '',
  conversions: '',
  roas: '',
  start_date: '',
  end_date: '',
}

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

function toNumber(value: number | string | null | undefined): number {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

function formatCompact(value: number) {
  return compactFormatter.format(value)
}

function formatDate(value: string | null) {
  if (!value) return '—'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getStatusClasses(status: string) {
  switch (status.toLowerCase()) {
    case 'active':
      return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
    case 'paused':
      return 'text-amber-300 bg-amber-500/10 border-amber-500/20'
    case 'completed':
      return 'text-gray-300 bg-gray-500/10 border-gray-500/20'
    default:
      return 'text-gray-300 bg-white/5 border-white/10'
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) return error.message
  return 'Something went wrong. Please try again.'
}

function validateForm(form: CampaignForm) {
  if (!form.name.trim()) return 'Campaign name is required.'
  if (!form.channel.trim()) return 'Channel is required.'

  const numericFields = [
    ['Budget', form.budget],
    ['Spent', form.spent],
    ['Impressions', form.impressions],
    ['Clicks', form.clicks],
    ['Conversions', form.conversions],
    ['ROAS', form.roas],
  ] as const

  for (const [label, value] of numericFields) {
    const parsed = Number(value || 0)
    if (!Number.isFinite(parsed) || parsed < 0) {
      return `${label} must be a valid non-negative number.`
    }
  }

  if (form.start_date && form.end_date && form.end_date < form.start_date) {
    return 'End date cannot be before start date.'
  }

  return ''
}

function buildForm(campaign: Campaign): CampaignForm {
  return {
    name: campaign.name ?? '',
    channel: campaign.channel ?? 'Other',
    status: STATUS_OPTIONS.includes(campaign.status as CampaignStatus)
      ? (campaign.status as CampaignStatus)
      : 'active',
    budget: String(toNumber(campaign.budget)),
    spent: String(toNumber(campaign.spent)),
    impressions: String(toNumber(campaign.impressions)),
    clicks: String(toNumber(campaign.clicks)),
    conversions: String(toNumber(campaign.conversions)),
    roas: String(toNumber(campaign.roas)),
    start_date: campaign.start_date ?? '',
    end_date: campaign.end_date ?? '',
  }
}

function createCampaignId() {
  return `CMP-${Date.now()}`
}

function CampaignModal({
  open,
  mode,
  form,
  saving,
  error,
  onClose,
  onChange,
  onSubmit,
}: {
  open: boolean
  mode: 'create' | 'edit'
  form: CampaignForm
  saving: boolean
  error: string
  onClose: () => void
  onChange: (field: keyof CampaignForm, value: string) => void
  onSubmit: () => void
}) {
  if (!open) return null

  const fields: Array<{
    key: keyof CampaignForm
    label: string
    type: 'text' | 'number' | 'date'
    placeholder?: string
    step?: string
  }> = [
    { key: 'name', label: 'Campaign name', type: 'text', placeholder: 'Q3 Search Acquisition' },
    { key: 'budget', label: 'Budget', type: 'number', placeholder: '10000', step: '0.01' },
    { key: 'spent', label: 'Spent', type: 'number', placeholder: '2500', step: '0.01' },
    { key: 'impressions', label: 'Impressions', type: 'number', placeholder: '120000', step: '1' },
    { key: 'clicks', label: 'Clicks', type: 'number', placeholder: '4200', step: '1' },
    { key: 'conversions', label: 'Conversions', type: 'number', placeholder: '180', step: '1' },
    { key: 'roas', label: 'ROAS', type: 'number', placeholder: '3.5', step: '0.01' },
    { key: 'start_date', label: 'Start date', type: 'date' },
    { key: 'end_date', label: 'End date', type: 'date' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4 py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-slate-900 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {mode === 'create' ? 'Create campaign' : 'Edit campaign'}
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {mode === 'create'
                ? 'Add campaign data to your connected workspace.'
                : 'Update the campaign metrics and status.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.key} className="block">
                <span className="mb-1.5 block text-xs font-medium text-gray-400">
                  {field.label}
                </span>
                <input
                  type={field.type}
                  step={field.step}
                  value={form[field.key]}
                  onChange={(event) => onChange(field.key, event.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.75 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-emerald-400/40"
                />
              </label>
            ))}

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-gray-400">Channel</span>
              <select
                value={form.channel}
                onChange={(event) => onChange('channel', event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.75 text-sm text-white outline-none focus:border-emerald-400/40"
              >
                {CHANNELS.map((channel) => (
                  <option key={channel} value={channel} className="bg-slate-900">
                    {channel}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-gray-400">Status</span>
              <select
                value={form.status}
                onChange={(event) => onChange('status', event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.75 text-sm text-white outline-none focus:border-emerald-400/40"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status} className="bg-slate-900">
                    {status[0].toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {mode === 'create' ? 'Create campaign' : 'Save changes'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | CampaignStatus>('all')
  const [channelFilter, setChannelFilter] = useState('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [form, setForm] = useState<CampaignForm>(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadCampaigns = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    setError('')

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw authError
      if (!user) throw new Error('Your session has expired. Please sign in again.')

      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, name, company')
        .eq('user_id', user.id)
        .maybeSingle()

      if (clientError) throw clientError

      if (!clientData) {
        setClient(null)
        setCampaigns([])
        return
      }

      const { data: campaignData, error: campaignsError } = await supabase
        .from('campaigns')
        .select(
          'id, name, client, status, budget, spent, impressions, clicks, conversions, roas, channel, start_date, end_date, client_id'
        )
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false })

      if (campaignsError) throw campaignsError

      setClient(clientData)
      setCampaigns((campaignData ?? []) as Campaign[])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void loadCampaigns()
  }, [loadCampaigns])

  const channelOptions = useMemo(() => {
    const unique = new Set(campaigns.map((campaign) => campaign.channel).filter(Boolean))
    return Array.from(unique).sort()
  }, [campaigns])

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return campaigns.filter((campaign) => {
      const matchesSearch =
        !normalizedSearch ||
        campaign.name.toLowerCase().includes(normalizedSearch) ||
        campaign.client.toLowerCase().includes(normalizedSearch) ||
        campaign.channel.toLowerCase().includes(normalizedSearch)

      const matchesStatus =
        statusFilter === 'all' ||
        campaign.status.toLowerCase() === statusFilter

      const matchesChannel =
        channelFilter === 'all' ||
        campaign.channel === channelFilter

      return matchesSearch && matchesStatus && matchesChannel
    })
  }, [campaigns, channelFilter, search, statusFilter])

  const summary = useMemo(() => {
    const spend = campaigns.reduce((sum, campaign) => sum + toNumber(campaign.spent), 0)
    const revenue = campaigns.reduce(
      (sum, campaign) =>
        sum + toNumber(campaign.spent) * toNumber(campaign.roas),
      0
    )
    const active = campaigns.filter(
      (campaign) => campaign.status.toLowerCase() === 'active'
    ).length
    const conversions = campaigns.reduce(
      (sum, campaign) => sum + toNumber(campaign.conversions),
      0
    )

    return {
      spend,
      revenue,
      active,
      conversions,
      roas: spend > 0 ? revenue / spend : 0,
    }
  }, [campaigns])

  const updateForm = (field: keyof CampaignForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (formError) setFormError('')
  }

  const openCreateModal = () => {
    setModalMode('create')
    setEditingCampaign(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setModalOpen(true)
  }

  const openEditModal = (campaign: Campaign) => {
    setModalMode('edit')
    setEditingCampaign(campaign)
    setForm(buildForm(campaign))
    setFormError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return
    setModalOpen(false)
    setFormError('')
  }

  const saveCampaign = async () => {
    const validationError = validateForm(form)

    if (validationError) {
      setFormError(validationError)
      return
    }

    if (!client) {
      setFormError('No client workspace is connected to this account.')
      return
    }

    setSaving(true)
    setFormError('')

    const budget = toNumber(form.budget)
    const spent = toNumber(form.spent)
    const impressions = Math.round(toNumber(form.impressions))
    const clicks = Math.round(toNumber(form.clicks))
    const conversions = Math.round(toNumber(form.conversions))
    const roas = toNumber(form.roas)

    try {
      if (modalMode === 'create') {
        const { error: insertError } = await supabase.from('campaigns').insert({
          id: createCampaignId(),
          name: form.name.trim(),
          client: client.company?.trim() || client.name,
          status: form.status,
          budget,
          spent,
          impressions,
          clicks,
          conversions,
          roas,
          channel: form.channel.trim(),
          start_date: form.start_date || null,
          end_date: form.end_date || null,
          client_id: client.id,
        })

        if (insertError) throw insertError
      } else {
        if (!editingCampaign) throw new Error('No campaign selected for editing.')

        const { error: updateError } = await supabase
          .from('campaigns')
          .update({
            name: form.name.trim(),
            status: form.status,
            budget,
            spent,
            impressions,
            clicks,
            conversions,
            roas,
            channel: form.channel.trim(),
            start_date: form.start_date || null,
            end_date: form.end_date || null,
          })
          .eq('id', editingCampaign.id)

        if (updateError) throw updateError
      }

      setModalOpen(false)
      await loadCampaigns(true)
    } catch (err) {
      setFormError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (campaign: Campaign) => {
    const nextStatus = campaign.status.toLowerCase() === 'active' ? 'paused' : 'active'
    setError('')

    const { error: updateError } = await supabase
      .from('campaigns')
      .update({ status: nextStatus })
      .eq('id', campaign.id)

    if (updateError) {
      setError(getErrorMessage(updateError))
      return
    }

    await loadCampaigns(true)
  }

  const deleteCampaign = async (campaign: Campaign) => {
    const confirmed = window.confirm(
      `Delete "${campaign.name}"? This action cannot be undone.`
    )

    if (!confirmed) return

    setDeletingId(campaign.id)
    setError('')

    try {
      const { error: deleteError } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaign.id)

      if (deleteError) throw deleteError
      setCampaigns((current) => current.filter((item) => item.id !== campaign.id))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-7 w-32 rounded bg-white/5 animate-pulse" />
          <div className="mt-2 h-4 w-72 rounded bg-white/5 animate-pulse" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 rounded-2xl border border-white/5 bg-slate-900 animate-pulse"
            />
          ))}
        </div>
        <div className="h-96 rounded-2xl border border-white/5 bg-slate-900 animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[420px] flex items-center justify-center">
        <div className="max-w-md rounded-2xl border border-red-500/10 bg-slate-900 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
            <AlertCircle className="h-6 w-6 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Campaigns unavailable</h2>
          <p className="mt-2 text-sm leading-6 text-gray-400">{error}</p>
          <button
            type="button"
            onClick={() => void loadCampaigns(true)}
            disabled={refreshing}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Connected workspace
            </div>
            <h1 className="text-xl font-bold text-white md:text-2xl">Campaigns</h1>
            <p className="mt-1 text-sm text-gray-400">
              Create, monitor, and update campaigns connected to your workspace.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void loadCampaigns(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              disabled={!client}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              New campaign
            </button>
          </div>
        </div>

        {!client && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
            Your account is not connected to a client workspace yet. Campaign creation is disabled until a workspace is provisioned.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Total campaigns',
              value: numberFormatter.format(campaigns.length),
              icon: Target,
              detail: `${summary.active} active`,
            },
            {
              label: 'Tracked spend',
              value: formatCurrency(summary.spend),
              icon: BarChart3,
              detail: 'Across connected campaigns',
            },
            {
              label: 'Attributed revenue',
              value: formatCurrency(summary.revenue),
              icon: Zap,
              detail: `Blended ${summary.roas.toFixed(2)}x ROAS`,
            },
            {
              label: 'Conversions',
              value: numberFormatter.format(summary.conversions),
              icon: Activity,
              detail: 'Tracked campaign conversions',
            },
          ].map(({ label, value, icon: Icon, detail }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-white/5 bg-slate-900 p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs text-gray-600">Live</span>
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="mt-1 text-sm text-gray-400">{label}</p>
              <p className="mt-1 text-xs text-gray-600">{detail}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-gray-500" />
            <input
              type="text"
              placeholder="Search campaigns, clients, or channels..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent text-sm text-gray-200 outline-none placeholder:text-gray-600"
            />
          </div>

          <div className="flex gap-3">
            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as 'all' | CampaignStatus)
                }
                className="bg-transparent text-sm text-gray-300 outline-none"
              >
                <option value="all" className="bg-slate-900">All status</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status} className="bg-slate-900">
                    {status[0].toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </label>

            <select
              value={channelFilter}
              onChange={(event) => setChannelFilter(event.target.value)}
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-gray-300 outline-none"
            >
              <option value="all" className="bg-slate-900">All channels</option>
              {channelOptions.map((channel) => (
                <option key={channel} value={channel} className="bg-slate-900">
                  {channel}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-4 md:px-6">
            <div>
              <h2 className="font-semibold text-white">Campaign list</h2>
              <p className="mt-1 text-xs text-gray-500">
                Showing {filtered.length} of {campaigns.length} campaigns
              </p>
            </div>
            <span className="hidden text-xs text-gray-600 sm:block">
              Workspace-scoped data
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-4 text-left text-[11px] font-medium uppercase tracking-wide text-gray-500 md:px-6">
                    Campaign
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-medium uppercase tracking-wide text-gray-500">
                    Channel
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-medium uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-4 text-right text-[11px] font-medium uppercase tracking-wide text-gray-500">
                    Budget
                  </th>
                  <th className="px-4 py-4 text-right text-[11px] font-medium uppercase tracking-wide text-gray-500">
                    Spent
                  </th>
                  <th className="px-4 py-4 text-right text-[11px] font-medium uppercase tracking-wide text-gray-500">
                    Conv.
                  </th>
                  <th className="px-4 py-4 text-right text-[11px] font-medium uppercase tracking-wide text-gray-500">
                    ROAS
                  </th>
                  <th className="w-14 px-4 py-4 text-right text-[11px] font-medium uppercase tracking-wide text-gray-500 md:px-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((campaign, index) => {
                  const spent = toNumber(campaign.spent)
                  const budget = toNumber(campaign.budget)
                  const spendPercent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0

                  return (
                    <motion.tr
                      key={campaign.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.025]"
                    >
                      <td className="px-4 py-4 md:px-6">
                        <div className="min-w-[230px]">
                          <p className="font-medium text-white">{campaign.name}</p>
                          <p className="mt-1 text-xs text-gray-600">
                            {formatDate(campaign.start_date)} → {formatDate(campaign.end_date)}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-300">{campaign.channel}</span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => void toggleStatus(campaign)}
                          title={
                            campaign.status.toLowerCase() === 'active'
                              ? 'Click to pause'
                              : 'Click to activate'
                          }
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize transition-opacity hover:opacity-80 ${getStatusClasses(campaign.status)}`}
                        >
                          {campaign.status}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-300">
                        {formatCurrency(budget)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="inline-flex min-w-[95px] flex-col items-end">
                          <span className="text-sm text-gray-300">{formatCurrency(spent)}</span>
                          <div className="mt-1 h-1 w-20 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${spendPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-300">
                        {formatCompact(toNumber(campaign.conversions))}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span
                          className={`text-sm font-bold ${
                            toNumber(campaign.roas) >= 5
                              ? 'text-emerald-300'
                              : toNumber(campaign.roas) >= 3
                                ? 'text-amber-300'
                                : 'text-red-300'
                          }`}
                        >
                          {toNumber(campaign.roas).toFixed(2)}x
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right md:px-6">
                        <details className="group relative">
                          <summary className="flex cursor-pointer list-none justify-end text-gray-500 hover:text-white [&::-webkit-details-marker]:hidden">
                            <MoreHorizontal className="h-5 w-5" />
                          </summary>
                          <div className="absolute right-0 top-8 z-20 w-40 rounded-xl border border-white/10 bg-slate-800 p-1.5 shadow-xl">
                            <button
                              type="button"
                              onClick={() => openEditModal(campaign)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void deleteCampaign(campaign)}
                              disabled={deletingId === campaign.id}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                            >
                              {deletingId === campaign.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              Delete
                            </button>
                          </div>
                        </details>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <h3 className="font-semibold text-white">
                  {campaigns.length === 0 ? 'No campaigns yet' : 'No matching campaigns'}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                  {campaigns.length === 0
                    ? 'Create your first campaign to start tracking spend, conversions, and ROAS.'
                    : 'Try a different search term or reset the filters.'}
                </p>
                {campaigns.length === 0 ? (
                  <button
                    type="button"
                    onClick={openCreateModal}
                    disabled={!client}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    Create campaign
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('')
                      setStatusFilter('all')
                      setChannelFilter('all')
                    }}
                    className="mt-5 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-600">
          Campaign data is loaded and mutated within the authenticated workspace. Access is enforced by Supabase RLS.
        </p>
      </div>

      <CampaignModal
        open={modalOpen}
        mode={modalMode}
        form={form}
        saving={saving}
        error={formError}
        onClose={closeModal}
        onChange={updateForm}
        onSubmit={() => void saveCampaign()}
      />
    </>
  )
}
