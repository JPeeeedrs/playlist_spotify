const token = 'BQBhGDJcjHOZOOtzvJHECHlJk4zisb7T8_D7TNM11hurKjiloNbqYuymt0AagA2ZcdYhUC3S-lkWriUCJiU85X6OPqwF8zWAEtfE9gNKx0YcCv89ETCg3VYsawcGVXHKbu-0mMArQxCsljmrVqWGdHkkliMr2quHtZh9-DeYlSu1NakgfD8w8M1oa-OTKvhs_w6vlc3RchyVCG3SjI-Z46kxPiEL0UKWb5iGEDljcGUH5a9C3kyrp85uHbrzyj19wrDaeJ7EwJuyY3VA11ZZjmy4MgpIWKOAP4atwZw7K0mIyP3xUt37z0Mnq4VS';

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
  return (await fetchWebApi('v1/me/top/tracks?time_range=long_term&limit=5', 'GET')).items;
}

async function getTopArtists() {
  return (await fetchWebApi('v1/me/top/artists?time_range=long_term&limit=5', 'GET')).items;
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
  const playlistId = '5lmWAd3SwcGALUnMjseJfX'; // ID da playlist
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
    renderPlaylistEmbed(); // Renderiza o embed da playlist
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    const tracksList = document.getElementById('tracksList');
    const artistsList = document.getElementById('artistsList');
    tracksList.innerHTML = '<li>Erro ao carregar músicas. Tente novamente.</li>';
    artistsList.innerHTML = '<li>Erro ao carregar artistas. Tente novamente.</li>';
  }
}

main();