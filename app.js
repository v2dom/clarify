// Placeholder for the login button
document.getElementById("loginButton").addEventListener("click", function () {
    // Example: You can replace this with actual OAuth logic
    console.log("Login clicked! Implement Spotify OAuth flow here.");
  
    // Redirect to Spotify authentication page (for demonstration)
    window.location.href = "https://accounts.spotify.com/authorize?client_id=c0bf7f17b46b4433b09d1eda0f48af69&response_type=code&redirect_uri=https%3A%2F%2Flocalhost%3A3000&scope=user-library-read";
  });
  