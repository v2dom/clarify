require('dotenv').config();
const express = require("express");
const SpotifyWebAPI = require("spotify-web-api-node");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Environment variables for security
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

// Token refresh endpoint
app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebAPI({
    clientId,
    clientSecret,
    redirectUri,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.error("Error refreshing token:", err);
      res.status(400).json({ error: "Failed to refresh token" });
    });
});

// Login endpoint
app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebAPI({
    clientId,
    clientSecret,
    redirectUri,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.error("Error during login:", err);
      res.status(400).json({ error: "Failed to log in" });
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});