const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.post('/get-token', async (req, res) => {
    console.log("req: ", req);


    const { code, redirect_uri, client_id, client_secret } = req.body;

    try {
        // Dynamically import `node-fetch`
        const { default: fetch } = await import('node-fetch');

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri,
                client_id,
                client_secret
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch access token' });
    }
});

// Function to get access token
async function getAccessToken() {
    const clientId = 'f79e0b879f934f29b9958a67acede833'; 
    const clientSecret = 'c14340530f5d4441a8db0961db6f06e0';
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${credentials}`
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials'
        })
    });

    const data = await response.json();
    return data.access_token;
}

// Function to fetch 90s songs
async function fetchNinetiesSongs() {
    const token = await getAccessToken();

    const response = await fetch('https://api.spotify.com/v1/search?' + new URLSearchParams({
        q: '90s',
        type: 'track',
        limit: 10
    }), {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return data.tracks.items.map(track => `${track.name} - ${track.artists.map(artist => artist.name).join(', ')}`);
}

// Endpoint to get 90s songs
app.post('/nineties-songs', async (req, res) => {
    try {
        const songs = await fetchNinetiesSongs();
        res.json(songs);
    } catch (error) {
        console.error('Error fetching 90s songs:', error);
        res.status(500).json({ error: 'Failed to fetch 90s songs' });
    }
});

app.get('/nineties-songsssss', async (req, res) => {
    try {
        const songs = await fetchNinetiesSongs();
        res.json(songs);
    } catch (error) {
        console.error('Error fetching 90s songs:', error);
        res.status(500).json({ error: 'Failed to fetch 90s songs' });
    }
});

app.listen(5500, () => {
    console.log('Server is running on http://localhost:5500');
});
