# WA
Rozmowa is a cozy, creative language and cultural hub combining Polish coffee culture, crafts workshops, and real conversation clubs. Our strategy is simple: no-stress English, crafts + coffee = community edge.

## Debugging 500 Internal Server Errors

If you see a 500 in the browser console, the error is on the server side. Use the steps below to pinpoint the root cause:

- Identify where the request is going from the web app. This repo's `web/vercel.json` rewrites `/api/(.*)` to `https://polyglot-api.onrender.com/$1`, so production API calls go to Render, not the local `api/` service.

1) Check Vercel (Web) logs
- Vercel Dashboard -> Project -> Deployments -> select the latest -> Logs
- If a rewrite targets Render and Render returns 500, Vercel proxies that 500. Vercel logs will usually show the request path and status but not the API stack trace.

2) Check Render (API) logs
- Render Dashboard -> Your API Service -> Logs
- Reproduce the request; look for stack traces or unhandled exceptions at the timestamp of the 500.

3) Local smoke test (optional)
- Run the API locally:
	- pnpm install
	- pnpm --filter @polyglot/api start
- Test endpoints:
	- GET /health -> 200 { status: 'ok' }
	- GET / -> 200 Hello message
	- GET /error -> 500 JSON body and server stack in terminal (non-prod)

4) Common causes
- Missing env vars/config on the server
- JSON body parsing missing (added in `api/server.js`)
- Unhandled promise rejections or thrown errors (now centralized handler logs stack)
- Upstream timeouts/failures if your API calls other services

Tip: Add structured logging (e.g., pino/pino-http) and request IDs for easier correlation across services.
