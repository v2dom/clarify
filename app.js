// clarify_backend_app.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors({
  origin: 'https://v2dom.dev',
  credentials: true
}));

app.use(express.json());

// 1. Spotify Login Route
app.get('/login', (req, res) => {
  const queryParams = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    redirect_uri: 'https://clarify-3zv7.onrender.com/callback',
    scope: 'user-top-read'
  });
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams.toString()}`);
});

// 2. Spotify Callback Route
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  try {
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'https://clarify-3zv7.onrender.com/callback'
      }),
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    const redirectUrl = new URL('https://v2dom.dev/clarify/home');
    redirectUrl.searchParams.set('access_token', access_token);
    redirectUrl.searchParams.set('refresh_token', refresh_token);
    redirectUrl.searchParams.set('expires_in', expires_in);
    console.log('Redirecting to:', redirectUrl.toString());
    res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('Token exchange failed:', error.response?.data || error.message);
    res.status(500).send('Spotify token exchange failed');
  }
});

// 3. Refresh Access Token
app.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token
      }),
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

    res.json(response.data);
  } catch (error) {
    console.error('Token refresh failed:', error.response?.data || error.message);
    res.status(400).json({ error: 'Failed to refresh token' });
  }
});

// Optional health check
app.get('/', (req, res) => {
  res.send('Clarify backend running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
