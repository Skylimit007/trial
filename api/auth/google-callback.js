export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  const client_id = process.env.GOOGLE_CLIENT_ID;
  const client_secret = process.env.GOOGLE_CLIENT_SECRET;
  const redirect_uri = process.env.REDIRECT_URI;

  if (!client_id || !client_secret || !redirect_uri) {
    return res.status(500).json({ error: 'Missing OAuth client configuration' });
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      return res.status(tokenResponse.status).json({ error: errorData.error_description || 'Token exchange failed' });
    }

    const tokenData = await tokenResponse.json();
    /* 
     * tokenData will contain:
     * - access_token
     * - expires_in
     * - refresh_token (if requested)
     * - scope
     * - token_type
     * - id_token
     */

    res.status(200).json(tokenData);

  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
