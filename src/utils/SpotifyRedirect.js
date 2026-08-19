const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

// documentation on code-pkce-flow spotify api can be found here
// https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow used for the creation of this code

// create code verifier

const codeVerifier = () => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(64));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

// removed as we will not be varing length
// const codeVerifier  = generateRandomString(64);

// Turns the verifier into a fixed-size, one-way "fingerprint" (32 bytes).
// One-way = can't be reversed back into the original verifier.
// This means even though this fingerprint will end up in a public URL later
// (after encoding), nobody can use it to work backwards and get our secret verifier.
const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

// The hash above is raw binary — not safe to drop straight into a URL
// (could contain characters that break the query string).
// base64 just re-represents those same bytes as URL-safe text.
// This step doesn't add any security, it's pure packaging/transport.
const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "") // strip padding, not URL-safe
    .replace(/\+/g, "-") // swap to URL-safe alphabet
    .replace(/\//g, "_"); // swap to URL-safe alphabet
};

export async function redirectToSpotifyAuthorize() {
  const verifier = codeVerifier(); // call it once
  const hashed = await sha256(verifier); // one-way fingerprint of our verifier
  const codeChallenge = base64encode(hashed); // same fingerprint, now safe to put in the authorize URL
  const authUrl = new URL("https://accounts.spotify.com/authorize");

  // generated in the previous step
  // stored in session as it will be delete once code retrieval complete
  sessionStorage.setItem("code_verifier", verifier);

  const params = {
    response_type: "code",
    client_id: clientId,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  authUrl.search = new URLSearchParams(params).toString();
  // browser navigates to Spotify's authorize page with our auth params in the URL —
  // this is where the user actually logs in and approves access
  window.location.href = authUrl.toString();
}
