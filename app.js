const express = require('express');
const axios = require('axios');
const app = express();

// 1. Spotify Login 
app.get('/login', (req, res) => {
  res.redirect(`https://accounts.spotify.com/authorize?${
    new URLSearchParams({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      redirect_uri: 'https://clarify-3zv7.onrender.com/callback',
      scope: 'user-top-read'
    })
  }`);
});

// 2. After Spotify redirects back
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  
  // Exchange code for tokens
  const { data } = await axios.post('https://accounts.spotify.com/api/token', 
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'https://clarify-3zv7.onrender.com/callback'
    }), {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  // Send tokens to frontend
  res.redirect(`https://v2dom.dev/?access_token=${data.access_token}`);
});

app.listen(3000);