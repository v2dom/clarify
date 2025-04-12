require('dotenv').config();
const express = require("express");
const SpotifyWebAPI = require("spotify-web-api-node");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Environment variables
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI || "https://v2dom.dev/clarify/home";

// Serve static files
app.use(express.static(path.join(__dirname)));

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "home.html"));
});

// Spotify Auth Endpoints
app.post("/login", async (req, res) => {
    const { code } = req.body;
    
    try {
        const spotifyApi = new SpotifyWebAPI({
            clientId,
            clientSecret,
            redirectUri
        });

        const data = await spotifyApi.authorizationCodeGrant(code);
        
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(400).json({ error: "Failed to log in" });
    }
});

app.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;
    
    try {
        const spotifyApi = new SpotifyWebAPI({
            clientId,
            clientSecret,
            refreshToken
        });

        const data = await spotifyApi.refreshAccessToken();
        
        res.json({
            accessToken: data.body.access_token,
            expiresIn: data.body.expires_in
        });
    } catch (err) {
        console.error("Refresh error:", err);
        res.status(400).json({ error: "Failed to refresh token" });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});