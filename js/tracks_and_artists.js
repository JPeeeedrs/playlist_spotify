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
  const playlistId = '5vEAO1TAta0Llc2BjRYPfu';
  const playlistEmbed = document.getElementById('playlistEmbed');

  const iframe = document.createElement('iframe');
  iframe.title = 'Spotify Embed: Recommendation Playlist';
  iframe.src = `https://open.spotify.com/embed/playlist/${playlistId}`;
  iframe.width = '100%';
  iframe.height = '360px';
  iframe.style.minHeight = '360px';
  iframe.frameBorder = '0';
  iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  iframe.loading = 'lazy';

  playlistEmbed.appendChild(iframe);
}

async function fetchTopData() {
  const res = await fetch('http://localhost:3000/top-data');
  const data = await res.json()
  return data;
}

async function main() {
  try {
    const { tracks, artists } = await fetchTopData();

    displayTopTracks(tracks);
    displayTopArtists(artists);
    renderPlaylistEmbed();
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    document.getElementById('tracksList').innerHTML = '<li>Erro ao carregar músicas. Tente novamente.</li>';
    document.getElementById('artistsList').innerHTML = '<li>Erro ao carregar artistas. Tente novamente.</li>';
  }
}

main();
