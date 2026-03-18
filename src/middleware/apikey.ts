import { createMiddleware } from 'hono/factory'
import { supabase } from '../lib/supabase'

export const apiKeyMiddleware = createMiddleware(async (c, next) => {
  const key = c.req.header('X-API-Key')

  if (!key) {
    return c.json({ error: 'Missing API key' }, 401)
  }

  const { data: partner, error } = await supabase
    .from('partners')
    .select('id, name, trust_weight, is_active, requests_today, rate_limit')
    .eq('api_key', key)
    .single()

  if (error || !partner) {
    return c.json({ error: 'Invalid API key' }, 401)
  }

  if (!partner.is_active) {
    return c.json({ error: 'API key disabled' }, 403)
  }

  if (partner.requests_today >= partner.rate_limit) {
    return c.json({ error: 'Rate limit exceeded' }, 429)
  }

  // increment request count
  await supabase
    .from('partners')
    .update({ requests_today: partner.requests_today + 1 })
    .eq('id', partner.id)

  c.set('partner', partner)
  await next()
})
