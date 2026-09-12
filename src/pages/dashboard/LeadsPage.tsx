import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Download,
  Mail,
  Building2,
  DollarSign,
  MessageSquare,
  Calendar,
  Eye,
  X,
  RefreshCw,
  ChevronDown,
  AlertCircle,
  Clock3,
} from 'lucide-react'
import { useLeads } from '../../hooks/useSupabase'
import { supabase } from '../../lib/supabase'

type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'won'
  | 'lost'

interface Lead {
  id: string
  name: string
  email: string
  company: string | null
  budget: string | null
  message: string
  created_at: string
  updated_at?: string
  client_id?: string | null
  status?: LeadStatus
  last_contacted_at?: string | null
  next_follow_up_at?: string | null
  internal_notes?: string | null
}

const STATUS_ORDER: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'won',
  'lost',
]

const statusConfig: Record<
  LeadStatus,
  {
    label: string
    className: string
    dotClass: string
  }
> = {
  new: {
    label: 'New',
    className:
      'text-blue-300 bg-blue-500/10 border-blue-500/20',
    dotClass: 'bg-blue-400',
  },
  contacted: {
    label: 'Contacted',
    className:
      'text-violet-300 bg-violet-500/10 border-violet-500/20',
    dotClass: 'bg-violet-400',
  },
  qualified: {
    label: 'Qualified',
    className:
      'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
    dotClass: 'bg-cyan-400',
  },
  proposal: {
    label: 'Proposal',
    className:
      'text-amber-300 bg-amber-500/10 border-amber-500/20',
    dotClass: 'bg-amber-400',
  },
  won: {
    label: 'Won',
    className:
      'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    dotClass: 'bg-emerald-400',
  },
  lost: {
    label: 'Lost',
    className:
      'text-red-300 bg-red-500/10 border-red-500/20',
    dotClass: 'bg-red-400',
  },
}

const budgetColors: Record<string, string> = {
  '50k-1L':
    'text-blue-400 bg-blue-500/10 border-blue-500/20',
  '1L-2.5L':
    'text-violet-400 bg-violet-500/10 border-violet-500/20',
  '2.5L-5L':
    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  '5L+':
    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
}

function formatDateTime(value?: string | null) {
  if (!value) return 'Not set'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date'
  }

  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function toDateTimeLocalValue(
  value?: string | null
) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const year = date.getFullYear()
  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0')
  const day = String(date.getDate()).padStart(
    2,
    '0'
  )
  const hours = String(date.getHours()).padStart(
    2,
    '0'
  )
  const minutes = String(
    date.getMinutes()
  ).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function isFollowUpOverdue(lead: Lead) {
  if (!lead.next_follow_up_at) return false

  if (
    lead.status === 'won' ||
    lead.status === 'lost'
  ) {
    return false
  }

  const followUpTime = new Date(
    lead.next_follow_up_at
  ).getTime()

  return (
    !Number.isNaN(followUpTime) &&
    followUpTime < Date.now()
  )
}

export default function LeadsPage() {
  const {
    data: leads,
    loading,
    error,
    refetch,
  } = useLeads()

  const [search, setSearch] = useState('')
  const [selected, setSelected] =
    useState<Lead | null>(null)

  const [updatingId, setUpdatingId] =
    useState<string | null>(null)

  const [savingFollowUp, setSavingFollowUp] =
    useState(false)

  const [actionError, setActionError] =
    useState('')

  const [followUpDate, setFollowUpDate] =
    useState('')

  const [internalNotes, setInternalNotes] =
    useState('')

  const normalizedLeads = useMemo<Lead[]>(
    () =>
      leads.map((lead) => ({
        ...lead,
        status: (lead.status ??
          'new') as LeadStatus,
      })),
    [leads]
  )

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim()

    if (!query) {
      return normalizedLeads
    }

    return normalizedLeads.filter(
      (lead) =>
        lead.name
          ?.toLowerCase()
          .includes(query) ||
        lead.email
          ?.toLowerCase()
          .includes(query) ||
        lead.company
          ?.toLowerCase()
          .includes(query) ||
        lead.status
          ?.toLowerCase()
          .includes(query)
    )
  }, [normalizedLeads, search])

  const counts = useMemo(() => {
    return STATUS_ORDER.reduce(
      (acc, status) => {
        acc[status] = filtered.filter(
          (lead) => lead.status === status
        ).length

        return acc
      },
      {} as Record<LeadStatus, number>
    )
  }, [filtered])

  const updateStatus = async (
    leadId: string,
    status: LeadStatus
  ) => {
    setUpdatingId(leadId)
    setActionError('')

    const now = new Date().toISOString()

    const payload: {
      status: LeadStatus
      updated_at: string
      last_contacted_at?: string
    } = {
      status,
      updated_at: now,
    }

    if (status === 'contacted') {
      payload.last_contacted_at = now
    }

    const { error: updateError } =
      await supabase
        .from('leads')
        .update(payload)
        .eq('id', leadId)

    if (updateError) {
      setActionError(updateError.message)
    } else {
      await refetch()

      if (selected?.id === leadId) {
        setSelected((current) =>
          current
            ? {
                ...current,
                status,
                updated_at: now,
                ...(status === 'contacted'
                  ? {
                      last_contacted_at:
                        now,
                    }
                  : {}),
              }
            : current
        )
      }
    }

    setUpdatingId(null)
  }

  const openLead = (lead: Lead) => {
    setSelected(lead)

    setInternalNotes(
      lead.internal_notes ?? ''
    )

    setFollowUpDate(
      toDateTimeLocalValue(
        lead.next_follow_up_at
      )
    )

    setActionError('')
  }

  const closeLead = () => {
    if (savingFollowUp) return

    setSelected(null)
    setActionError('')
    setFollowUpDate('')
    setInternalNotes('')
  }

  const markContacted = async () => {
    if (!selected) return

    setSavingFollowUp(true)
    setActionError('')

    const now = new Date().toISOString()

    const { data, error: updateError } =
      await supabase
        .from('leads')
        .update({
          status: 'contacted',
          last_contacted_at: now,
          updated_at: now,
        })
        .eq('id', selected.id)
        .select('*')
        .single()

    if (updateError) {
      setActionError(updateError.message)
    } else {
      const updatedLead = data as Lead

      setSelected(updatedLead)

      setInternalNotes(
        updatedLead.internal_notes ?? ''
      )

      setFollowUpDate(
        toDateTimeLocalValue(
          updatedLead.next_follow_up_at
        )
      )

      await refetch()
    }

    setSavingFollowUp(false)
  }

  const saveFollowUp = async () => {
    if (!selected) return

    setSavingFollowUp(true)
    setActionError('')

    const now = new Date().toISOString()

    const { data, error: updateError } =
      await supabase
        .from('leads')
        .update({
          internal_notes:
            internalNotes.trim() || null,
          next_follow_up_at: followUpDate
            ? new Date(
                followUpDate
              ).toISOString()
            : null,
          updated_at: now,
        })
        .eq('id', selected.id)
        .select('*')
        .single()

    if (updateError) {
      setActionError(updateError.message)
    } else {
      const updatedLead = data as Lead

      setSelected(updatedLead)

      setInternalNotes(
        updatedLead.internal_notes ?? ''
      )

      setFollowUpDate(
        toDateTimeLocalValue(
          updatedLead.next_follow_up_at
        )
      )

      await refetch()
    }

    setSavingFollowUp(false)
  }

  const clearFollowUp = () => {
    setFollowUpDate('')
    setActionError('')
  }

  const exportCSV = () => {
    const headers = [
      'Name',
      'Email',
      'Company',
      'Budget',
      'Status',
      'Last Contacted',
      'Next Follow-up',
      'Internal Notes',
      'Message',
      'Date',
    ]

    const escapeCSV = (
      value: string | null | undefined
    ) =>
      `"${(value ?? '')
        .replace(/"/g, '""')
        .replace(/\n/g, ' ')}"`

    const rows = normalizedLeads.map(
      (lead) => [
        escapeCSV(lead.name),
        escapeCSV(lead.email),
        escapeCSV(lead.company),
        escapeCSV(lead.budget),
        escapeCSV(
          statusConfig[
            lead.status ?? 'new'
          ].label
        ),
        escapeCSV(
          lead.last_contacted_at
            ? formatDateTime(
                lead.last_contacted_at
              )
            : ''
        ),
        escapeCSV(
          lead.next_follow_up_at
            ? formatDateTime(
                lead.next_follow_up_at
              )
            : ''
        ),
        escapeCSV(lead.internal_notes),
        escapeCSV(lead.message),
        escapeCSV(
          new Date(
            lead.created_at
          ).toLocaleDateString('en-IN')
        ),
      ]
    )

    const csv = [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')

    anchor.href = url
    anchor.download = 'profitplus-leads.csv'

    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()

    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Lead Pipeline
          </h1>

          <p className="text-gray-400 mt-1 text-sm">
            Manage website enquiries from first
            contact to closed deal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold rounded-xl transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Errors */}
      {(error || actionError) && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />

          <p className="text-sm text-red-300">
            {error || actionError}
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {STATUS_ORDER.map((status) => (
          <div
            key={status}
            className="p-4 bg-slate-900 border border-white/5 rounded-xl"
          >
            <p className="text-2xl font-bold text-white">
              {counts[status]}
            </p>

            <p className="text-gray-400 text-xs mt-1">
              {statusConfig[status].label}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />

        <input
          type="text"
          placeholder="Search name, email, company or status..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
        />

        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-gray-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Pipeline */}
      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-6 gap-4 min-w-[1320px]">
          {STATUS_ORDER.map((status) => {
            const statusLeads =
              filtered.filter(
                (lead) =>
                  lead.status === status
              )

            return (
              <div
                key={status}
                className="space-y-3"
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${statusConfig[status].dotClass}`}
                    />

                    <h2 className="text-sm font-semibold text-white">
                      {
                        statusConfig[status]
                          .label
                      }
                    </h2>
                  </div>

                  <span className="text-xs text-gray-500">
                    {statusLeads.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[220px] p-2 rounded-2xl bg-white/[0.02] border border-white/5">
                  {statusLeads.length === 0 ? (
                    <div className="h-40 flex items-center justify-center text-xs text-gray-600">
                      No leads
                    </div>
                  ) : (
                    statusLeads.map(
                      (lead, index) => {
                        const overdue =
                          isFollowUpOverdue(
                            lead
                          )

                        return (
                          <motion.div
                            key={lead.id}
                            initial={{
                              opacity: 0,
                              y: 8,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              delay:
                                index * 0.03,
                            }}
                            className="p-4 bg-slate-900 border border-white/5 rounded-xl hover:border-emerald-500/20 transition-all"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-white font-semibold text-sm truncate">
                                  {
                                    lead.name
                                  }
                                </p>

                                <p className="text-gray-500 text-xs mt-1 truncate">
                                  {
                                    lead.email
                                  }
                                </p>
                              </div>

                              {lead.budget && (
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium border whitespace-nowrap ${
                                    budgetColors[
                                      lead
                                        .budget
                                    ] ??
                                    'text-gray-400 bg-gray-500/10 border-gray-500/20'
                                  }`}
                                >
                                  {
                                    lead.budget
                                  }
                                </span>
                              )}
                            </div>

                            {lead.company && (
                              <div className="flex items-center gap-1 mt-3 text-gray-500 text-xs">
                                <Building2 className="w-3 h-3" />

                                <span className="truncate">
                                  {
                                    lead.company
                                  }
                                </span>
                              </div>
                            )}

                            {lead.next_follow_up_at && (
                              <div
                                className={`flex items-center gap-1.5 mt-3 text-[10px] ${
                                  overdue
                                    ? 'text-red-300'
                                    : 'text-gray-500'
                                }`}
                              >
                                <Clock3 className="w-3 h-3 flex-shrink-0" />

                                <span className="truncate">
                                  {overdue
                                    ? `Overdue · ${formatDateTime(
                                        lead.next_follow_up_at
                                      )}`
                                    : `Follow-up · ${formatDateTime(
                                        lead.next_follow_up_at
                                      )}`}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-2 mt-4">
                              <button
                                onClick={() =>
                                  openLead(
                                    lead
                                  )
                                }
                                className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 text-gray-400 hover:text-emerald-400 text-xs font-medium rounded-lg transition-all"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View
                              </button>

                              <a
                                href={`mailto:${lead.email}`}
                                className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-all"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                Reply
                              </a>
                            </div>

                            <div className="relative mt-3">
                              <select
                                value={
                                  lead.status
                                }
                                disabled={
                                  updatingId ===
                                  lead.id
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateStatus(
                                    lead.id,
                                    event
                                      .target
                                      .value as LeadStatus
                                  )
                                }
                                className={`w-full appearance-none px-3 py-2 pr-8 rounded-lg text-xs font-medium border outline-none cursor-pointer bg-slate-950 ${
                                  statusConfig[
                                    lead
                                      .status ??
                                      'new'
                                  ]
                                    .className
                                } disabled:opacity-50`}
                              >
                                {STATUS_ORDER.map(
                                  (
                                    option
                                  ) => (
                                    <option
                                      key={
                                        option
                                      }
                                      value={
                                        option
                                      }
                                    >
                                      Move to{' '}
                                      {
                                        statusConfig[
                                          option
                                        ]
                                          .label
                                      }
                                    </option>
                                  )
                                )}
                              </select>

                              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                            </div>
                          </motion.div>
                        )
                      }
                    )
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lead modal */}
      {selected && (
        <>
          {/* Visual backdrop only — DOES NOT capture scrolling */}
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm pointer-events-none" />

          {/* Modal layer — only the modal captures pointer events */}
          <div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            aria-hidden="true"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.97,
                y: 8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.18,
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="lead-details-title"
              className="pointer-events-auto w-full max-w-2xl h-[min(800px,calc(100vh-2rem))] max-h-[calc(100vh-2rem)] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Fixed modal header */}
              <div className="flex-shrink-0 flex items-center justify-between gap-4 px-6 py-5 border-b border-white/10 bg-slate-900">
                <div className="min-w-0">
                  <h3
                    id="lead-details-title"
                    className="text-white font-bold text-lg"
                  >
                    Lead Details
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        statusConfig[
                          selected.status ??
                            'new'
                        ].className
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          statusConfig[
                            selected.status ??
                              'new'
                          ].dotClass
                        }`}
                      />

                      {
                        statusConfig[
                          selected.status ??
                            'new'
                        ].label
                      }
                    </span>

                    {isFollowUpOverdue(
                      selected
                    ) && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-red-300 bg-red-500/10 border border-red-500/20">
                        <Clock3 className="w-3 h-3" />
                        Overdue
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={closeLead}
                  disabled={savingFollowUp}
                  aria-label="Close lead details"
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ONLY this area scrolls */}
              <div
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
                style={{
                  scrollbarGutter: 'stable',
                }}
              >
                <div className="px-6 py-5">
                  {/* Lead information */}
                  <div className="space-y-3">
                    {[
                      {
                        icon: Mail,
                        label: 'Name',
                        value:
                          selected.name,
                      },
                      {
                        icon: Mail,
                        label: 'Email',
                        value:
                          selected.email,
                      },
                      {
                        icon: Building2,
                        label: 'Company',
                        value:
                          selected.company ||
                          'Not provided',
                      },
                      {
                        icon: DollarSign,
                        label: 'Budget',
                        value:
                          selected.budget ||
                          'Not specified',
                      },
                      {
                        icon: Calendar,
                        label: 'Submitted',
                        value:
                          formatDateTime(
                            selected.created_at
                          ),
                      },
                      {
                        icon: Calendar,
                        label: 'Updated',
                        value:
                          selected
                            .updated_at
                            ? formatDateTime(
                                selected.updated_at
                              )
                            : 'Not updated',
                      },
                    ].map(
                      ({
                        icon: Icon,
                        label,
                        value,
                      }) => (
                        <div
                          key={label}
                          className="flex items-start gap-3 p-3.5 bg-white/5 rounded-xl"
                        >
                          <Icon className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />

                          <div className="min-w-0">
                            <p className="text-gray-400 text-xs">
                              {label}
                            </p>

                            <p className="text-white text-sm font-medium break-words mt-0.5">
                              {value}
                            </p>
                          </div>
                        </div>
                      )
                    )}

                    {/* Message */}
                    <div className="p-3.5 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-emerald-400" />

                        <p className="text-gray-400 text-xs">
                          Message
                        </p>
                      </div>

                      <p className="text-white text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {selected.message ||
                          'No message provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Follow-up Management */}
                  <div className="mt-5 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <h4 className="text-white text-sm font-semibold">
                          Follow-up Management
                        </h4>

                        <p className="text-gray-500 text-xs mt-1">
                          Track outreach and upcoming
                          follow-ups for this lead.
                        </p>
                      </div>

                      <button
                        onClick={
                          markContacted
                        }
                        disabled={
                          savingFollowUp
                        }
                        className="inline-flex items-center justify-center px-3.5 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium hover:bg-violet-500/20 disabled:opacity-50 transition-all"
                      >
                        {savingFollowUp
                          ? 'Saving...'
                          : 'Mark Contacted'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                      <div>
                        <label
                          htmlFor="next-follow-up"
                          className="block text-xs text-gray-400 mb-2"
                        >
                          Next Follow-up
                        </label>

                        <input
                          id="next-follow-up"
                          type="datetime-local"
                          value={
                            followUpDate
                          }
                          onChange={(
                            event
                          ) =>
                            setFollowUpDate(
                              event
                                .target
                                .value
                            )
                          }
                          className="w-full min-w-0 px-3 py-2.5 bg-slate-950 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-2">
                          Last Contacted
                        </label>

                        <div className="w-full min-h-[42px] px-3 py-2.5 flex items-center bg-slate-950 border border-white/10 rounded-lg text-sm text-gray-300">
                          {selected.last_contacted_at
                            ? formatDateTime(
                                selected.last_contacted_at
                              )
                            : 'Not contacted yet'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor="internal-notes"
                        className="block text-xs text-gray-400 mb-2"
                      >
                        Internal Notes
                      </label>

                      <textarea
                        id="internal-notes"
                        rows={4}
                        value={
                          internalNotes
                        }
                        onChange={(
                          event
                        ) =>
                          setInternalNotes(
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Add private sales notes..."
                        className="w-full px-3 py-3 bg-slate-950 border border-white/10 rounded-lg text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 resize-none transition-all"
                      />

                      <p className="text-[11px] text-gray-600 mt-2">
                        These notes are for your
                        internal sales workflow.
                      </p>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 mt-5 pt-4 border-t border-white/5">
                      <button
                        onClick={
                          clearFollowUp
                        }
                        disabled={
                          savingFollowUp ||
                          !followUpDate
                        }
                        className="px-4 py-2.5 bg-white/5 border border-white/10 text-gray-400 text-sm font-medium rounded-lg hover:bg-white/10 disabled:opacity-40 transition-all"
                      >
                        Clear Follow-up
                      </button>

                      <button
                        onClick={
                          saveFollowUp
                        }
                        disabled={
                          savingFollowUp
                        }
                        className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold rounded-lg disabled:opacity-50 transition-all"
                      >
                        {savingFollowUp
                          ? 'Saving...'
                          : 'Save Follow-up'}
                      </button>
                    </div>
                  </div>

                  {actionError && (
                    <div className="flex items-start gap-2.5 mt-4 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />

                      <p className="text-xs text-red-300">
                        {actionError}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Fixed footer */}
              <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 px-6 py-4 border-t border-white/10 bg-slate-900">
                <button
                  onClick={closeLead}
                  disabled={savingFollowUp}
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 text-gray-400 text-sm font-medium rounded-xl hover:bg-white/10 disabled:opacity-50 transition-all"
                >
                  Close
                </button>

                <a
                  href={`mailto:${selected.email}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold rounded-xl transition-all"
                >
                  <Mail className="w-4 h-4" />
                  Reply Now
                </a>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  )
}