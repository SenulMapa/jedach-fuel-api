import { Hono } from 'hono'
import { supabase } from '../lib/supabase'

const reports = new Hono()

// POST /reports — submit a crowdsourced report
reports.post('/', async (c) => {
  const partner = c.get('partner')
  const body = await c.req.json()
  const { station_id, fuel_type, status, queue_length } = body

  if (!station_id || !fuel_type || !status) {
    return c.json({ error: 'station_id, fuel_type, status are required' }, 400)
  }

  const validFuelTypes = ['petrol_92', 'petrol_95', 'diesel', 'super_diesel']
  const validStatuses = ['available', 'limited', 'unavailable']

  if (!validFuelTypes.includes(fuel_type)) {
    return c.json({ error: `fuel_type must be one of: ${validFuelTypes.join(', ')}` }, 400)
  }

  if (!validStatuses.includes(status)) {
    return c.json({ error: `status must be one of: ${validStatuses.join(', ')}` }, 400)
  }

  // partner reports get higher trust weight
  const trust_weight = partner?.trust_weight || 0.5

  const { data, error } = await supabase
    .from('reports')
    .insert({
      station_id,
      fuel_type,
      status,
      queue_length: queue_length || 0,
      partner_id: partner?.id,
      trust_weight,
      expires_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString()
    })
    .select()
    .single()

  if (error) return c.json({ error: error.message }, 500)

  // trust engine trigger fires automatically in DB
  return c.json({ data, message: 'Report submitted, fuel status updated' }, 201)
})

// GET /reports/:station_id — recent reports for a station
reports.get('/:station_id', async (c) => {
  const { station_id } = c.req.param()

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('station_id', station_id)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) return c.json({ error: error.message }, 500)

  return c.json({ data, count: data?.length })
})

export default reports
