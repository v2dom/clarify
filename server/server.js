const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const app = express();
const path = require("path");

app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON requests

// Serve the frontend (if you're serving static HTML)
app.use(express.static(path.join(__dirname, "public")));

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route to exchange Spotify Authorization Code for Access Token
app.post("/api/spotify/token", async (req, res) => {
  const { code } = req.body;

  const clientId = "c0bf7f17b46b4433b09d1eda0f48af69";
  const clientSecret = "27c98fdbd46d41f38ea0eb10a0cdfae1";
  const redirectUri = "http://localhost:3000"; // Your redirect URI

  // Construct the POST request for Spotify's token endpoint
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

    // Send the access token and refresh token back to the frontend
    res.json({
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
    });
  } catch (error) {
    console.error("Error exchanging token:", error);
    res.status(500).json({ error: "Error connecting to Spotify" });
  }
});

// Start the backend server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
