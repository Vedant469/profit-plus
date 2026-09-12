import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useCampaigns() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCampaigns = useCallback(async () => {
    setLoading(true)

    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })

    setData(campaigns ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  return { data, loading, refetch: fetchCampaigns }
}

export function useReports() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReports = useCallback(async () => {
    setLoading(true)

    const { data: reports } = await supabase
      .from('reports')
      .select('*')
      .order('date', { ascending: false })

    setData(reports ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  return { data, loading, refetch: fetchReports }
}

export function useLeads() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (leadsError) {
      setError(leadsError.message)
      setData([])
    } else {
      setData(leads ?? [])
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  return {
    data,
    loading,
    error,
    refetch: fetchLeads,
  }
}