import { Hono } from 'hono'
import { supabase } from '../lib/supabase'

const stations = new Hono()

// GET /stations — all stations with current fuel status
stations.get('/', async (c) => {
  const { lat, lng, radius } = c.req.query()

  let query = supabase
    .from('stations')
    .select(`
      *,
      fuel_status (
        fuel_type,
        status,
        confidence,
        queue_length,
        last_updated
      )
    `)

  const { data, error } = await query

  if (error) return c.json({ error: error.message }, 500)

  // filter by distance if lat/lng provided
  if (lat && lng && radius) {
    const userLat = parseFloat(lat)
    const userLng = parseFloat(lng)
    const maxRadius = parseFloat(radius) || 5000 // default 5km in meters

    const filtered = data?.filter(station => {
      const R = 6371e3
      const φ1 = userLat * Math.PI / 180
      const φ2 = station.latitude * Math.PI / 180
      const Δφ = (station.latitude - userLat) * Math.PI / 180
      const Δλ = (station.longitude - userLng) * Math.PI / 180
      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2)
      const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      return d <= maxRadius
    })

    return c.json({ data: filtered, count: filtered?.length })
  }

  return c.json({ data, count: data?.length })
})

// GET /stations/:id — single station with full fuel status
stations.get('/:id', async (c) => {
  const { id } = c.req.param()

  const { data, error } = await supabase
    .from('stations')
    .select(`
      *,
      fuel_status (
        fuel_type,
        status,
        confidence,
        queue_length,
        last_updated
      )
    `)
    .eq('id', id)
    .single()

  if (error) return c.json({ error: 'Station not found' }, 404)

  return c.json({ data })
})

// POST /stations — add a new station
stations.post('/', async (c) => {
  const body = await c.req.json()
  const { name, address, latitude, longitude, phone } = body

  if (!name || !latitude || !longitude) {
    return c.json({ error: 'name, latitude, longitude are required' }, 400)
  }

  const { data, error } = await supabase
    .from('stations')
    .insert({ name, address, latitude, longitude, phone })
    .select()
    .single()

  if (error) return c.json({ error: error.message }, 500)

  return c.json({ data }, 201)
})

export default stations
