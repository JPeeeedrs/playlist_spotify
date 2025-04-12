require("dotenv").config();

const express = require("express");
const axios = require("axios");
const querystring = require("querystring");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// credenciais
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

app.get('/', (req, res) => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=user-top-read`;
  res.redirect(authUrl);
});

// Rota para capturar o código de autorização
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) return res.status(400).send('Nenhum código fornecido.');

  try {
    const tokenRes = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri
    }), {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    res.json({
      access_token: tokenRes.data.access_token,
      refresh_token: tokenRes.data.refresh_token,
      expires_in: tokenRes.data.expires_in
      });
    } catch (error) {
      console.error("Erro ao obter token:", error);
      res.status(500).send("Erro ao obter o token.");
    }
});

// Rota para renovar o token de acesso
app.post("/refresh", async (req, res) => {
  const refreshToken = req.body.refresh_token;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token é obrigatório" });
  }

  try {
    const response = await axios.post("https://accounts.spotify.com/api/token", querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    }), {
      headers: {
        "Authorization": "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    accessToken = response.data.access_token;

    res.json({
      access_token: response.data.access_token,
      expires_in: response.data.expires_in
    });
  } catch (error) {
    console.error("Erro ao renovar token:", error);
    res.status(500).json({ error: "Erro ao renovar token" });
  }
});

// Nova Rota para obter as faixas e artistas
app.get("/top-data", async (req, res) => {
  try {
    const [tracksResponse, artistsResponse] = await Promise.all([axios.get("https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }),

    axios.get("https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }),
  ]);

    res.json({
      tracks: tracksResponse.data.items,
      artists: artistsResponse.data.items
    });
  } catch (error) {
    console.error("Erro ao obter dados:", error.response?.data || error.message);
    res.status(500).send("Erro ao obter dados do Spotify.");
  }
})

// Rota inicial para iniciar o processo de autorização
app.get("/", (req, res) => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=user-read-private%20user-read-email`;
  res.redirect(authUrl);
});

// Inicia o servidor na porta 3000
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
