import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useCampaigns() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false })
      setData(campaigns ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  return { data, loading }
}

export function useReports() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data: reports } = await supabase
        .from('reports')
        .select('*')
        .order('date', { ascending: false })
      setData(reports ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  return { data, loading }
}

export function useLeads() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
      setData(leads ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  return { data, loading }
}