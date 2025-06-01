/**
 * Serverless function to redirect to Google's OAuth 2.0 authorization endpoint
 * Hardcoded variables for client ID and redirect URI included.
 */

export default function handler(req, res) {
  // Hardcoded OAuth parameters
  const clientId = '755429138864-fkb57r7p2thout8qupf5g0281d0ef21d.apps.googleusercontent.com';
  const redirectUri = 'http://localhost:3000/api/callback'; // Adjust if hosting domain differs
  const scope = encodeURIComponent('openid email profile');
  const responseType = 'code';
  const accessType = 'offline';
  const prompt = 'consent'; // Forces consent screen always
  const state = 'some_random_state'; // Replace with real state handling for production

  // Construct the Google OAuth 2.0 URL
  const authUrl =
    'https://accounts.google.com/o/oauth2/v2/auth?' +
    `client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=${responseType}` +
    `&scope=${scope}` +
    `&access_type=${accessType}` +
    `&prompt=${prompt}` +
    `&state=${state}`;

  // Redirect the user to Google OAuth consent screen
  res.writeHead(302, { Location: authUrl });
  res.end();
}

