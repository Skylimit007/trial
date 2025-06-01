import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Hardcoded values
  const clientId = '755429138864-fkb57r7p2thout8qupf5g0281d0ef21d.apps.googleusercontent.com ';
  const clientSecret = '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';
  // This must match the redirectUri used in auth.js
  const redirectUri = 'https://www.nextedgeinnovations.org/api/callback';
  const targetPage = 'https://www.nextedgeinnovations.org/protected.html'; // The page to redirect after sign in

  const smtpHost = 'smtp.example.com'; // Your SMTP host, e.g. smtp.gmail.com
  const smtpPort = 465; // Usually 465 for SSL or 587 for TLS
  const smtpUser = 'honest.oigo@strathmore.edu'; // SMTP username/email
  const smtpPass = 'mgce fvwy wipu jrky '; // SMTP password or app password

  // Extract the authorization code from query
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Missing code parameter');
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('Failed to get access token');
    }

    const accessToken = tokenData.access_token;

    // Fetch user info
    const userInfoResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userInfo = await userInfoResponse.json();

    // Prepare email content
    const mailOptions = {
      from: smtpUser,
      to: 'your_receiving_email@example.com', // Change to your email to receive the notifications
      subject: 'New Google Sign-In Notification',
      text: `User signed in:\n\nName: ${userInfo.name}\nEmail: ${userInfo.email}\nProfile: ${userInfo.picture}`,
    };

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Send email
    await transporter.sendMail(mailOptions);

    // Redirect the user to the target page after sign-in and notifying
    res.writeHead(302, { Location: targetPage });
    res.end();
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    res.status(500).send('Authentication failed');
  }
}

