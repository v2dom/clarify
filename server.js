const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname,"home.html"));
});

app.post("/api/spotify/token", async (req, res) => {
    const { code } = req.body;

    const clientId = "c0bf7f17b46b4433b09d1eda0f48af69";
    const redirectUri = "https://v2dom.dev/clarify/home";
    const scope = "user-top-read user-library-read";

    console.log("Authorization Code Received:", code);

    try {
        console.log("Exchanging authorization code for access token...");

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

        console.log("Token exchange successful. Response data:", response.data);

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

app.post("/api/spotify/refresh", async (req, res) => {
    const { refresh_token } = req.body;

    const clientId = "c0bf7f17b46b4433b09d1eda0f48af69";
    const clientSecret = "0b2207eb4ec046fbab6c41e77573206a";

    console.log("Received refresh token:", refresh_token);

    try {
        console.log("Refreshing access token...");

        const response = await axios.post("https://accounts.spotify.com/api/token", null, {
            params: {
                grant_type: "refresh_token",
                refresh_token: refresh_token,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(clientId + ":" + clientSecret).toString("base64")}`,
            },
        });

        console.log("Token refresh successful. Response data:", response.data);

        res.json({
            access_token: response.data.access_token,
            expires_in: response.data.expires_in,
        });
    } catch (error) {
        console.error("Error refreshing token:", error.response?.data || error.message);
        res.status(500).json({ error: "Error refreshing Spotify token" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
