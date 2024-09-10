const clientId = "f79e0b879f934f29b9958a67acede833"; // Replace with your Client ID
const redirectUri = "http://localhost:5500"; // Replace with your redirect URI
const scopes = "user-read-private user-read-email";
const clientSecret = "c14340530f5d4441a8db0961db6f06e0";

document.getElementById("login-btn").addEventListener("click", () => {
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes)}`;
  window.location.href = authUrl;
});

document
  .getElementById("btnLoad90sSong")
  .addEventListener("click", function () {
    fetch("http://localhost:5500/nineties-songs", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        data.map((value) => {
          ulList.innerHTML += `
                    <li>${value}</li>
                `;
        });
      });
  });

// This will handle the redirect after login
if (window.location.search.includes("code=")) {
  const code = new URLSearchParams(window.location.search).get("code");
  fetchAccessToken(code);
}

function fetchAccessToken(code) {
  fetch("http://localhost:5500/get-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: "c14340530f5d4441a8db0961db6f06e0", // Replace with your Client Secret
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.access_token) {
        fetchUserInfo(data.access_token);
      }
    });
}

function fetchUserInfo(token) {
  fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("user-info").innerHTML = `
                    <h2>Welcome, ${data.display_name}</h2>
                    <img src="${data.images[0]?.url}" alt="Profile Picture" width="100">
                `;
    });
}
