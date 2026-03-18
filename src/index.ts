import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { apiKeyMiddleware } from './middleware/apikey'
import stations from './routes/stations'
import reports from './routes/reports'

const app = new Hono()

// middleware
app.use('*', logger())
app.use('*', cors())

// public routes
app.get('/', (c) => c.json({
  name: 'Jedach Fuel API',
  version: '1.0.0',
  docs: 'https://github.com/jedach/fuel-api',
  status: 'operational'
}))

app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// protected routes
app.use('/api/*', apiKeyMiddleware)
app.route('/api/stations', stations)
app.route('/api/reports', reports)

// 404
app.notFound((c) => c.json({ error: 'Route not found' }, 404))

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch
}
