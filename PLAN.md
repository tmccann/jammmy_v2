# Jammming — build plan

A Spotify playlist builder built with Vite, React, and Tailwind. Connects to a user's Spotify account to display their profile and playlists, and lets them edit existing playlists or create new ones.

## Constraints
*Source: [Spotify — Update on Developer Access and Platform Security](https://developer.spotify.com/blog) (Feb 6, 2026)*

- **Spotify Premium required** — Development Mode now mandates a Premium account
- **Max 5 authorized users** per Client ID (Development Mode cap)
- **One Development Mode Client ID** per developer
- **Limited endpoint set** — Development Mode only has access to a smaller set of supported endpoints; check the [supported endpoints list](https://developer.spotify.com/documentation/web-api/references/changes/february-2026) before building against any specific API call

*Source: [Spotify — Web API Changelog, February 2026](https://developer.spotify.com/documentation/web-api/references/changes/february-2026)*

- **No API-level Premium check** — the `product` field (which used to expose "premium"/"free") was removed from the user object. There's no way to programmatically
    confirm a user is Premium; the requirement can only be stated to the user, not enforced in code, unless a Premium-only action fails at runtime and that failure is handled
- **Own playlists only** — `GET /users/{id}/playlists` (another user's playlists) was removed. The app can only read/edit the logged-in user's own playlists
    via `/me/playlists`
- **Search results capped at 10** — the `limit` param on `GET /search` now maxes at 10 (was 50), default 5. Track search UI needs to account for smaller batches, likely
    with pagination (`offset`) if showing more than 10 results

## Phase 0 — scaffolding

- [x] `npm create vite` with the React template
- [x] Install and configure Tailwind
- [x] Confirm a blank page renders
- [x] Set up `.gitignore`, `.env.example`
- [x] First commit
- **Done when:** page loads with red text


## Phase 1 — Spotify auth
*Information for this phase was sourced from Spotify's official Web API documentation.*
>
> Source: [Spotify — PKCE flow](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow)

The authorization code flow with PKCE is the recommended authorization flow if you're implementing authorization in a mobile app or single page web app.

- [ ] Register app in Spotify developer dashboard, set redirect URI

> **IMPORTANT:**
> - **Use HTTPS** for your redirect URI, unless you are using a **loopback address**, in which case HTTP is permitted.
> - If using a loopback address, use the **explicit IPv4 or IPv6** address, like `http://127.0.0.1:PORT` or `http://[::1]:PORT`.
> - **`localhost` is not allowed** as a redirect URI.
>
> Source: [Spotify — Redirect URI](https://developer.spotify.com/documentation/web-api/concepts/redirect_uri)

- [ ] Add `.env` with `VITE_SPOTIFY_CLIENT_ID` and `VITE_SPOTIFY_REDIRECT_URI`, confirm `.env` is in `.gitignore`
- [ ] Update `.env.example` so the repo documents required vars without exposing real values
- [ ] Connect button on `ConnectScreen` triggers redirect
- [ ] Generate code verifier + challenge, redirect to Spotify authorize
- [ ] Read `code` from URL on return, store in session storage
- [ ] Set up `authStatus` state: `"loggedOut" | "loading" | "loggedIn" | "error"`
- [ ] Set `authStatus` to `"loading"` while the token exchange is in flight
- [ ] Exchange `code` + verifier for access token, store in `localStorage`
- [ ] On success, set `authStatus` to `"loggedIn"` and store token in state
- [ ] On failure, set `authStatus` to `"error"` and capture an error message
- [ ] Header renders differently per `authStatus`: logged out / loading / logged in / error
- **Done when:** clicking connect round-trips back with a token, and all four states (logged out, loading, logged in, error) render correctly in the header