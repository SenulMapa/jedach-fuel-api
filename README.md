# Jedach Fuel API

Open source fuel availability infrastructure for Sri Lanka.

Built by [Jedach](https://github.com/jedach) to solve the fragmented fuel data problem.

## What this is

The backend engine powering Sri Lanka's fuel data. Instead of 10 apps with scattered crowdsourced data, this provides a single open API that any frontend can plug into.

## Features

- Real time fuel availability per station (petrol 92, 95, diesel, super diesel)
- Trust engine: weighted crowdsource reports with time decay
- Partner API system: verified platforms get higher trust weight
- Shed owner verification layer
- Near me filtering via lat/lng + radius
- Queue length reporting

## Stack

- Bun + Hono
- Supabase (PostgreSQL + Realtime)
- TypeScript

## Getting started
```bash
git clone https://github.com/jedach/jedach-fuel-api
cd jedach-fuel-api
bun install
cp .env.example .env
# fill in your Supabase credentials
bun run --hot src/index.ts
```

## API

All protected routes require `X-API-Key` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/stations` | All stations with fuel status |
| GET | `/api/stations?lat=6.91&lng=79.85&radius=5000` | Nearby stations |
| GET | `/api/stations/:id` | Single station |
| POST | `/api/stations` | Add station |
| POST | `/api/reports` | Submit fuel report |
| GET | `/api/reports/:station_id` | Recent reports for station |

## Want to integrate?

Open an issue or reach out to get a partner API key.

## License

MIT
