const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Root route (Serve index.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Home route (Serve home.html)
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Spotify Token Exchange Route
app.post("/api/spotify/token", async (req, res) => {
    const { code } = req.body;

    const clientId = "c0bf7f17b46b4433b09d1eda0f48af69";
    const clientSecret = "27c98fdbd46d41f38ea0eb10a0cdfae1";
    const redirectUri = "http://localhost:3000/home"; // Redirecting to /home after login

    try {
        const response = await axios.post("https://accounts.spotify.com/api/token", null, {
            params: {
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirectUri,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(clientId + ":" + clientSecret).toString("base64")}`,
            },
        });

        res.json({
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expires_in: response.data.expires_in,
        });
    } catch (error) {
        console.error("Error exchanging token:", error.response?.data || error.message);
        res.status(500).json({ error: "Error connecting to Spotify" });
    }
});

// Start the backend server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
