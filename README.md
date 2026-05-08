# Siri Reservation Status MVP

Minimal NestJS prototype for this flow:

`Siri -> Apple Shortcut -> GET /reservations/status -> summary spoken aloud`

## Project Structure

```text
.
|-- package.json
|-- nest-cli.json
|-- tsconfig.json
|-- tsconfig.build.json
|-- src
|   |-- main.ts
|   |-- app.module.ts
|   `-- reservations
|       |-- reservations.module.ts
|       |-- reservations.controller.ts
|       |-- reservations.service.ts
|       `-- types
|           `-- reservation-status-response.type.ts
`-- README.md
```

## Install

```bash
npm install
```

## Run Locally

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3000/reservations/status
```

## Test with curl

```bash
curl http://localhost:3000/reservations/status
```

## Run with Docker

Build the image:

```bash
docker build -t siri-reservation-status-mvp .
```

Run the container:

```bash
docker run --rm -p 3000:3000 siri-reservation-status-mvp
```

The API will then be available at:

```text
http://localhost:3000/reservations/status
```

## Expose with ngrok

1. Install ngrok from https://ngrok.com/downloads
2. Start the NestJS app:

```bash
npm run start:dev
```

3. In a second terminal, expose port 3000:

```bash
ngrok http 3000
```

4. Copy the public HTTPS URL from ngrok, for example:

```text
https://abc123.ngrok-free.app
```

5. Your Shortcut should call:

```text
https://abc123.ngrok-free.app/reservations/status
```

## Apple Shortcut Setup

Create a new Shortcut on iPhone, for example named:

```text
Reservation Status
```

Suggested Siri phrase:

```text
Give me reservation status
```

### Shortcut steps

1. Add `Get Contents of URL`
2. Set URL to:

```text
https://YOUR-NGROK-URL/reservations/status
```

3. Expand the action settings:
   - Method: `GET`
   - Request Body: `None`
4. Add `Get Dictionary Value`
   - Dictionary: `Get Contents of URL`
   - Key: `summary`
5. Add `Speak Text`
   - Text: `Dictionary Value`

When the Shortcut runs, Siri should speak the summary returned by the API.

## Siri Test

After saving the Shortcut, say:

```text
Hey Siri, give me reservation status
```

Expected result:

1. Siri runs the Shortcut
2. The Shortcut calls your ngrok URL
3. NestJS returns the hardcoded JSON
4. The Shortcut extracts `summary`
5. Siri reads the summary aloud

## Next Improvements

- Add a real database
- Add authentication or an API token
- Add date filters such as `today` and `tomorrow`
- Add endpoints for pending payments
- Connect to a real booking or reservation system
- Deploy the API publicly instead of relying on ngrok
