const express = require("express");
const SpotifWebAPI = require("spotify-web-api-node");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifWebAPI({
    redirectUri: "https://v2dom.dev/clarify/home",
    clientId: "e8acbd5e26d4445681fb69ea7112c35c",
    clientSecret: "cabf3a9d6a4e4ba79d4b0bb1caa802c1",
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

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifWebAPI({
    redirectUri: "https://v2dom.dev/clarify/home",
    clientId: "c0bf7f17b46b4433b09d1eda0f48af69",
    clientSecret: "0b2207eb4ec046fbab6c41e77573206a",
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

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});