const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // Allow cross-origin requests

const SPOTIFY_CLIENT_ID = "c0bf7f17b46b4433b09d1eda0f48af69";
const SPOTIFY_CLIENT_SECRET = "27c98fdbd46d41f38ea0eb10a0cdfae1";
const REDIRECT_URI = "https://v2dom.dev/clarify/home";

app.post("/api/spotify/token", async (req, res) => {
    const { code } = req.body;

    try {
        const response = await axios.post("https://accounts.spotify.com/api/token", new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: REDIRECT_URI,
            client_id: SPOTIFY_CLIENT_ID,
            client_secret: SPOTIFY_CLIENT_SECRET
        }).toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        res.json(response.data); // Send access token to frontend
    } catch (error) {
        console.error("Error exchanging code for token:", error.response?.data || error);
        res.status(500).json({ error: "Failed to get access token" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
