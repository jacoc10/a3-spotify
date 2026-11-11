/**
 * Spotify Data Fetcher
 *
 * Fetches real data from the Spotify API for Carly Rae Jepsen and saves it
 * as JSON files for the dummy server to serve.
 *
 * Usage:
 *   node fetch-data.js <client_id> <client_secret>
 *
 * Or create a client_secret.json file with:
 *   { "client_id": "YOUR_ID", "client_secret": "YOUR_SECRET" }
 *
 * Then run:
 *   node fetch-data.js
 */

var fetch = require('node-fetch');
var fs = require('fs');
var path = require('path');

// Carly Rae Jepsen's Spotify ID
var CRJ_ID = '6sFIWsNpZYqfjUpaCgueju';

var dataDir = path.join(__dirname, 'data');
var access_token = null;

// ============================================================
// Helpers
// ============================================================

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function saveJSON(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('  Saved: ' + filePath);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// Spotify API
// ============================================================

async function getClientCredentialsToken(client_id, client_secret) {
  var params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  var response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get access token: ' + response.status + ' ' + response.statusText);
  }

  var json = await response.json();
  return json.access_token;
}

async function spotifyGet(endpoint) {
  var url = 'https://api.spotify.com/v1' + endpoint;
  var response = await fetch(url, {
    headers: {
      'Authorization': 'Bearer ' + access_token
    }
  });

  if (response.status === 429) {
    // Rate limited - wait and retry
    var retryAfter = parseInt(response.headers.get('Retry-After') || '5', 10);
    console.log('  Rate limited, waiting ' + retryAfter + 's...');
    await sleep(retryAfter * 1000);
    return spotifyGet(endpoint);
  }

  if (!response.ok) {
    throw new Error('API error: ' + response.status + ' for ' + url);
  }

  return response.json();
}

// ============================================================
// Data Fetching
// ============================================================

async function fetchAndSaveArtist(artistId) {
  console.log('Fetching artist: ' + artistId);
  var data = await spotifyGet('/artists/' + artistId);
  saveJSON(path.join(dataDir, 'artists', artistId + '.json'), data);
  return data;
}

async function fetchAndSaveArtistAlbums(artistId) {
  console.log('Fetching albums for artist: ' + artistId);
  // Fetch up to 50 albums
  var data = await spotifyGet('/artists/' + artistId + '/albums?limit=50&include_groups=album,single,compilation');
  saveJSON(path.join(dataDir, 'artist-albums', artistId + '.json'), data);
  return data;
}

async function fetchAndSaveArtistTopTracks(artistId) {
  console.log('Fetching top tracks for artist: ' + artistId);
  var data = await spotifyGet('/artists/' + artistId + '/top-tracks?country=US');
  saveJSON(path.join(dataDir, 'artist-top-tracks', artistId + '.json'), data);
  return data;
}

async function fetchAndSaveAlbum(albumId) {
  console.log('Fetching album: ' + albumId);
  var data = await spotifyGet('/albums/' + albumId);
  saveJSON(path.join(dataDir, 'albums', albumId + '.json'), data);
  return data;
}

async function fetchAndSaveAlbumTracks(albumId) {
  console.log('Fetching tracks for album: ' + albumId);
  var data = await spotifyGet('/albums/' + albumId + '/tracks?limit=50');
  saveJSON(path.join(dataDir, 'album-tracks', albumId + '.json'), data);
  return data;
}

async function fetchAndSaveTrack(trackId) {
  console.log('Fetching track: ' + trackId);
  var data = await spotifyGet('/tracks/' + trackId);
  saveJSON(path.join(dataDir, 'tracks', trackId + '.json'), data);
  return data;
}

async function fetchAndSaveSearch(category, query) {
  console.log('Fetching search: ' + category + ' / ' + query);
  var params = new URLSearchParams();
  params.append('q', query);
  params.append('type', category);
  params.append('limit', '20');
  var data = await spotifyGet('/search?' + params);
  saveJSON(path.join(dataDir, 'search', category + '.json'), data);
  return data;
}

// ============================================================
// Main
// ============================================================

async function main() {
  // Get credentials
  var client_id, client_secret;

  if (process.argv.length >= 4) {
    client_id = process.argv[2];
    client_secret = process.argv[3];
  } else {
    try {
      var secretFile = JSON.parse(fs.readFileSync('client_secret.json', 'utf8'));
      client_id = secretFile.client_id;
      client_secret = secretFile.client_secret;
    } catch (e) {
      console.error('Usage: node fetch-data.js <client_id> <client_secret>');
      console.error('   Or: create a client_secret.json file with client_id and client_secret');
      process.exit(1);
    }
  }

  console.log('Getting access token...');
  access_token = await getClientCredentialsToken(client_id, client_secret);
  console.log('Got access token.\n');

  // 1. Fetch CRJ artist data
  console.log('=== Fetching Carly Rae Jepsen data ===\n');
  var artist = await fetchAndSaveArtist(CRJ_ID);
  await sleep(100);

  // 2. Fetch CRJ albums
  var albumsList = await fetchAndSaveArtistAlbums(CRJ_ID);
  await sleep(100);

  // 3. Fetch CRJ top tracks
  var topTracks = await fetchAndSaveArtistTopTracks(CRJ_ID);
  await sleep(100);

  // 4. Fetch each album's full data and tracks
  console.log('\n=== Fetching individual album data ===\n');
  var allTrackIds = new Set();

  // Collect track IDs from top tracks
  if (topTracks.tracks) {
    topTracks.tracks.forEach(function(t) { allTrackIds.add(t.id); });
  }

  for (var i = 0; i < albumsList.items.length; i++) {
    var albumItem = albumsList.items[i];
    await sleep(200); // Be nice to the API
    var albumFull = await fetchAndSaveAlbum(albumItem.id);

    await sleep(200);
    var albumTracks = await fetchAndSaveAlbumTracks(albumItem.id);

    // Collect track IDs from album tracks
    if (albumTracks.items) {
      albumTracks.items.forEach(function(t) { allTrackIds.add(t.id); });
    }
  }

  // 5. Fetch each individual track
  console.log('\n=== Fetching individual track data ===\n');
  var trackIds = Array.from(allTrackIds);
  for (var j = 0; j < trackIds.length; j++) {
    await sleep(150);
    await fetchAndSaveTrack(trackIds[j]);
  }

  // 6. Fetch search results
  console.log('\n=== Fetching search results ===\n');
  await fetchAndSaveSearch('artist', 'Carly Rae Jepsen');
  await sleep(200);
  await fetchAndSaveSearch('album', 'Carly Rae Jepsen');
  await sleep(200);
  await fetchAndSaveSearch('track', 'Carly Rae Jepsen');

  // 7. Create a fake /me profile
  console.log('\n=== Creating profile data ===\n');
  saveJSON(path.join(dataDir, 'me.json'), {
    display_name: 'CS Student',
    external_urls: { spotify: 'https://open.spotify.com/user/cs_student' },
    images: [
      { url: artist.images && artist.images.length > 0 ? artist.images[0].url : '', height: 300, width: 300 }
    ],
    id: 'cs_student',
    type: 'user',
    uri: 'spotify:user:cs_student'
  });

  // 8. Create unknown fallback data
  console.log('\n=== Creating unknown fallback data ===\n');
  saveJSON(path.join(dataDir, 'unknown', 'artist.json'), {
    name: 'Unknown Artist',
    id: 'unknown',
    images: [],
    external_urls: { spotify: 'https://open.spotify.com' },
    popularity: 0,
    genres: [],
    followers: { total: 0 },
    type: 'artist',
    uri: 'spotify:artist:unknown'
  });

  saveJSON(path.join(dataDir, 'unknown', 'album.json'), {
    name: 'Unknown Album',
    id: 'unknown',
    images: [],
    external_urls: { spotify: 'https://open.spotify.com' },
    popularity: 0,
    genres: [],
    artists: [
      {
        name: 'Unknown Artist',
        id: 'unknown',
        external_urls: { spotify: 'https://open.spotify.com' },
        type: 'artist',
        uri: 'spotify:artist:unknown'
      }
    ],
    release_date: '2000-01-01',
    total_tracks: 0,
    type: 'album',
    uri: 'spotify:album:unknown'
  });

  saveJSON(path.join(dataDir, 'unknown', 'track.json'), {
    name: 'Unknown Track',
    id: 'unknown',
    images: [],
    external_urls: { spotify: 'https://open.spotify.com' },
    popularity: 0,
    duration_ms: 0,
    artists: [
      {
        name: 'Unknown Artist',
        id: 'unknown',
        external_urls: { spotify: 'https://open.spotify.com' },
        type: 'artist',
        uri: 'spotify:artist:unknown'
      }
    ],
    album: {
      name: 'Unknown Album',
      id: 'unknown',
      images: [],
      external_urls: { spotify: 'https://open.spotify.com' },
      artists: [
        {
          name: 'Unknown Artist',
          id: 'unknown',
          external_urls: { spotify: 'https://open.spotify.com' },
          type: 'artist',
          uri: 'spotify:artist:unknown'
        }
      ],
      genres: [],
      type: 'album',
      uri: 'spotify:album:unknown'
    },
    type: 'track',
    uri: 'spotify:track:unknown'
  });

  console.log('\nDone! All data saved to ' + dataDir);
  console.log('You can now start the server with: npm start');
}

main().catch(function(err) {
  console.error('Error:', err);
  process.exit(1);
});
