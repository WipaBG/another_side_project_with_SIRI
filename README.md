# Siri Summer Villa MVP

Minimal NestJS API for Siri Shortcuts managing summer villa reservations, payments, room status, cleaning, and guest lookup. Every Siri endpoint returns a top-level `summary` string for Apple Shortcuts `Speak Text`.

## Install and Run

Install dependencies:

```bash
npm install
```

Run in development:

```bash
npm run start:dev
```

The local API runs at `http://localhost:3000`.

## Project Structure

```text
src/
  common/utils/    date, money, and summary helpers
  data/            hardcoded mock guests, rooms, and reservations
  guests/          guest search, details, stay, payments, contact card
  payments/        pending payments and revenue summary
  reservations/    daily overview, check-ins, and check-outs
  rooms/           room status and date availability
  tasks/           cleaning tasks
  types/           shared TypeScript models and API response types
```

## Test with curl

```bash
curl http://localhost:3000/reservations/status
curl http://localhost:3000/reservations/check-ins/today
curl http://localhost:3000/reservations/check-outs/today
curl http://localhost:3000/reservations/check-ins/tomorrow
curl http://localhost:3000/payments/pending
curl http://localhost:3000/payments/summary?period=this_week
curl http://localhost:3000/rooms/status
curl "http://localhost:3000/rooms/availability?date=2026-06-15"
curl http://localhost:3000/tasks/cleaning/today
curl "http://localhost:3000/guests/search?name=Maria%20Georgieva"
curl http://localhost:3000/guests/1
curl http://localhost:3000/guests/1/current-stay
curl http://localhost:3000/guests/1/payments
curl http://localhost:3000/guests/1/contact-card
```

Guest search uses exact full-name matching in this MVP, so use `Maria Georgieva` rather than `Maria`.

## Expose with ngrok

1. Install ngrok from https://ngrok.com/downloads
2. Start the API with `npm run start:dev`
3. In a second terminal run:

```bash
ngrok http 3000
```

4. Copy the public HTTPS URL, for example `https://abc123.ngrok-free.app`
5. Point your Shortcut URL to `https://abc123.ngrok-free.app/reservations/status`

## Create a Siri Shortcut

1. Create a new Shortcut on iPhone.
2. Add `URL` with one API endpoint.
3. Add `Get Contents of URL`.
4. Add `Get Dictionary Value` with key `summary`.
5. Add `Speak Text`.

Suggested Shortcut names:

- Reservation Status
- Today Check Ins
- Today Check Outs
- Pending Payments
- Room Status
- Find Guest Maria
- Guest Info Maria
- Contact Guest Maria

## Next Improvements

- Add SQLite or PostgreSQL
- Add authentication with API key
- Add admin dashboard
- Add create/edit reservation endpoints
- Add payment marking endpoint
- Add cleaning task completion endpoint
- Add Twilio/Viber/WhatsApp guest messaging
- Add real booking platform integration
- Add Bulgarian and English Siri summaries
