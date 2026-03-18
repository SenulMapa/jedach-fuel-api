# Jedach Fuel API

Open source fuel availability infrastructure for Sri Lanka.

Built by [Senul Mapa](https://github.com/SenulMapa/SenulMap)(By Jedach) to solve the fragmented fuel data problem across crowdsourced fuel tracking platforms.

## Live API

`https://jedach-fuel-api.mapasenul.workers.dev`

## What this is

The backend engine powering Sri Lanka's fuel data. Instead of multiple apps with scattered crowdsourced data, this provides a single open API that any frontend can plug into.

## Features

- Real time fuel availability per station (petrol 92, 95, diesel, super diesel)
- Trust engine: weighted crowdsource reports with time decay
- Partner API system: verified platforms get higher trust weight
- Shed owner verification layer
- Nearby station filtering via lat/lng + radius
- Queue length reporting

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | None | Health check |
| GET | `/api/stations` | API Key | All stations with fuel status |
| GET | `/api/stations?lat=6.91&lng=79.85&radius=5000` | API Key | Nearby stations |
| GET | `/api/stations/:id` | API Key | Single station |
| POST | `/api/stations` | API Key | Add a station |
| POST | `/api/reports` | API Key | Submit a fuel report |
| GET | `/api/reports/:station_id` | API Key | Recent reports for a station |

## Authentication

All protected routes require an `X-API-Key` header:
```
X-API-Key: your-partner-api-key
```

## Report payload
```json
{
  "station_id": "uuid",
  "fuel_type": "petrol_92 | petrol_95 | diesel | super_diesel",
  "status": "available | limited | unavailable",
  "queue_length": 0
}
```

## Want to integrate?

Open an issue or reach out to get a partner API key. Partner reports carry higher trust weight in the engine.

## Contributing

PRs welcome. Check the issues tab for what needs work.

## License

MIT
