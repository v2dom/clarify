const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Spotify API credentials (you should store these in environment variables)
const SPOTIFY_CLIENT_ID = 'YOUR_CLIENT_ID';
const SPOTIFY_CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const SPOTIFY_REDIRECT_URI = 'YOUR_REDIRECT_URI'; // Should match the redirect URI in Spotify Developer Dashboard

// Endpoint to handle the OAuth code exchange
app.get('/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Authorization code is missing.');
    }

    try {
        // Step 1: Exchange the authorization code for an access token
        const response = await axios.post('https://accounts.spotify.com/api/token', null, {
            params: {
                code: code,
                redirect_uri: SPOTIFY_REDIRECT_URI,
                grant_type: 'authorization_code',
                client_id: SPOTIFY_CLIENT_ID,
                client_secret: SPOTIFY_CLIENT_SECRET,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // Step 2: Use the access token (for example, make a Spotify API call)
        const accessToken = response.data.access_token;

        // Return the access token (you could also store it in a session or database)
        res.send(`Access Token: ${accessToken}`);

    } catch (error) {
        console.error('Error exchanging code for token:', error);
        res.status(500).send('Failed to exchange authorization code for token.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
