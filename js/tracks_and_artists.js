const token = 'BQD873uywfd4g4IfX1cIH8BBsaWcDwgKIho_vg5m1evHzclMFPWQnuI9RtigpJslZMoLKoIgqqIO6autLPUEqTK8lXnMSjoW7TzYeGNAHe6Ym5t-qaKqzUyinCNtP84PZRi8ge6ofYLD7AjX2zLtsEJb3rFJUkTtN3CaR1KO_SRMSDkV2gqT1t7T13OxWKM77TPlmpjgoEZpb0_du7p-WKcj0r3Wuz13rezVuHpYX99o69uhZXWEHcJA44niQ-E';

async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: JSON.stringify(body),
  });
  return await res.json();
}

async function getTopTracks() {
  const response = await fetchWebApi('v1/me/top/tracks?time_range=short_term&limit=10', 'GET');
  return response.items;
}

async function getTopArtists() {
  return (await fetchWebApi('v1/me/top/artists?time_range=short_term&limit=10', 'GET')).items;
}

function formatDuration(durationMs) {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = ((durationMs % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, '0')}`;
}

function displayTopTracks(tracks) {
  const tracksList = document.getElementById('tracksList');
  tracksList.innerHTML = '';

  if (!tracks || tracks.length === 0) {
    tracksList.innerHTML = '<li>Nenhuma música encontrada.</li>';
    return;
  }

  tracks.forEach((track) => {
    const trackItem = document.createElement('li');

    const trackImage = document.createElement('img');
    trackImage.src = track.album.images[0].url;
    trackItem.appendChild(trackImage);

    const trackInfo = document.createElement('div');
    trackInfo.className = 'track-info';

    const trackName = document.createElement('div');
    trackName.textContent = track.name;
    trackInfo.appendChild(trackName);

    const albumName = document.createElement('span');
    albumName.textContent = `Álbum: ${track.album.name}`;
    trackInfo.appendChild(albumName);

    const duration = document.createElement('span');
    duration.textContent = `Duração: ${formatDuration(track.duration_ms)}`;
    trackInfo.appendChild(duration);

    trackItem.appendChild(trackInfo);
    tracksList.appendChild(trackItem);
  });
}

function displayTopArtists(artists) {
  const artistsList = document.getElementById('artistsList');
  artistsList.innerHTML = '';

  if (!artists || artists.length === 0) {
    artistsList.innerHTML = '<li>Nenhum artista encontrado.</li>';
    return;
  }

  artists.forEach((artist) => {
    const artistItem = document.createElement('li');

    const artistImage = document.createElement('img');
    artistImage.src = artist.images[0].url;
    artistItem.appendChild(artistImage);

    const artistInfo = document.createElement('div');
    artistInfo.className = 'artist-info';

    const artistName = document.createElement('div');
    artistName.textContent = artist.name;
    artistInfo.appendChild(artistName);

    const genres = document.createElement('span');
    genres.textContent = `Gêneros: ${artist.genres.join(', ')}`;
    artistInfo.appendChild(genres);

    artistItem.appendChild(artistInfo);
    artistsList.appendChild(artistItem);
  });
}

function renderPlaylistEmbed() {
  const playlistId = '5lmWAd3SwcGALUnMjseJfX';
  const playlistEmbed = document.getElementById('playlistEmbed');

  const iframe = document.createElement('iframe');
  iframe.title = 'Spotify Embed: Recommendation Playlist';
  iframe.src = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;
  iframe.width = '100%';
  iframe.height = '360px';
  iframe.style.minHeight = '360px';
  iframe.frameBorder = '0';
  iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  iframe.loading = 'lazy';

  playlistEmbed.appendChild(iframe);
}

async function main() {
  try {
    const topTracks = await getTopTracks();
    const topArtists = await getTopArtists();

    displayTopTracks(topTracks);
    displayTopArtists(topArtists);
    renderPlaylistEmbed();
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    const tracksList = document.getElementById('tracksList');
    const artistsList = document.getElementById('artistsList');
    tracksList.innerHTML = '<li>Erro ao carregar músicas. Tente novamente.</li>';
    artistsList.innerHTML = '<li>Erro ao carregar artistas. Tente novamente.</li>';
  }
}

main();
