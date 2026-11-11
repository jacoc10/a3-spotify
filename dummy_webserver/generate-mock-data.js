/**
 * Mock Data Generator
 *
 * Generates comprehensive mock data for Carly Rae Jepsen so the dummy server
 * works out of the box without Spotify credentials.
 *
 * Usage: node generate-mock-data.js
 *
 * The generated data can later be replaced with real data by running:
 *   node fetch-data.js <client_id> <client_secret>
 */

var fs = require('fs');
var path = require('path');

var dataDir = path.join(__dirname, 'data');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function saveJSON(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('  Saved: ' + path.relative(__dirname, filePath));
}

// ============================================================
// CRJ Artist Data
// ============================================================

var CRJ_ID = '6sFIWsNpZYqfjUpaCgueju';

var CRJ_IMAGES = [
  { url: 'https://i.scdn.co/image/ab6761610000e5eb7baf4d2e2cc3b23a2e4adb88', height: 640, width: 640 },
  { url: 'https://i.scdn.co/image/ab676161000051747baf4d2e2cc3b23a2e4adb88', height: 320, width: 320 },
  { url: 'https://i.scdn.co/image/ab6761610000f1787baf4d2e2cc3b23a2e4adb88', height: 160, width: 160 }
];

var CRJ_ARTIST_SIMPLIFIED = {
  name: 'Carly Rae Jepsen',
  id: CRJ_ID,
  external_urls: { spotify: 'https://open.spotify.com/artist/' + CRJ_ID },
  type: 'artist',
  uri: 'spotify:artist:' + CRJ_ID
};

var CRJ_ARTIST_FULL = {
  name: 'Carly Rae Jepsen',
  id: CRJ_ID,
  external_urls: { spotify: 'https://open.spotify.com/artist/' + CRJ_ID },
  images: CRJ_IMAGES,
  popularity: 72,
  genres: ['dance pop', 'pop'],
  followers: { total: 7162543 },
  type: 'artist',
  uri: 'spotify:artist:' + CRJ_ID
};

// ============================================================
// Albums
// ============================================================

var ALBUMS = [
  {
    id: '3BNJkkJLxZzr2nIgv1c2QS',
    name: 'The Loneliest Time',
    release_date: '2022-10-21',
    total_tracks: 13,
    images: [
      { url: 'https://i.scdn.co/image/ab67616d0000b273b26787e1aa244ea1378472a4', height: 640, width: 640 },
      { url: 'https://i.scdn.co/image/ab67616d00001e02b26787e1aa244ea1378472a4', height: 300, width: 300 },
      { url: 'https://i.scdn.co/image/ab67616d00004851b26787e1aa244ea1378472a4', height: 64, width: 64 }
    ],
    popularity: 55,
    tracks: [
      { name: 'Surrender My Heart', duration_ms: 193626, track_number: 1 },
      { name: 'Joshua Tree', duration_ms: 207133, track_number: 2 },
      { name: 'Beach House', duration_ms: 219573, track_number: 3 },
      { name: 'Bends', duration_ms: 205066, track_number: 4 },
      { name: 'Talking to Yourself', duration_ms: 231200, track_number: 5 },
      { name: 'Far Away', duration_ms: 222906, track_number: 6 },
      { name: 'Sideways', duration_ms: 211106, track_number: 7 },
      { name: 'So Nice', duration_ms: 168226, track_number: 8 },
      { name: 'Bad Thing Twice', duration_ms: 188893, track_number: 9 },
      { name: 'The Loneliest Time (feat. Rufus Wainwright)', duration_ms: 250680, track_number: 10 },
      { name: 'Anxious', duration_ms: 218386, track_number: 11 },
      { name: 'Go Find Yourself or Whatever', duration_ms: 210693, track_number: 12 },
      { name: 'Western Wind', duration_ms: 254920, track_number: 13 }
    ]
  },
  {
    id: '6TGd66r0nlPaYwRKJqYbRx',
    name: 'Dedicated Side B',
    release_date: '2020-05-21',
    total_tracks: 12,
    images: [
      { url: 'https://i.scdn.co/image/ab67616d0000b2733e4b53264e80b060b3928a3c', height: 640, width: 640 },
      { url: 'https://i.scdn.co/image/ab67616d00001e023e4b53264e80b060b3928a3c', height: 300, width: 300 },
      { url: 'https://i.scdn.co/image/ab67616d000048513e4b53264e80b060b3928a3c', height: 64, width: 64 }
    ],
    popularity: 52,
    tracks: [
      { name: 'This Love Isn\'t Crazy', duration_ms: 222493, track_number: 1 },
      { name: 'Window', duration_ms: 179933, track_number: 2 },
      { name: 'Felt This Way', duration_ms: 221946, track_number: 3 },
      { name: 'Stay Away', duration_ms: 203346, track_number: 4 },
      { name: 'Fake Mona Lisa', duration_ms: 252266, track_number: 5 },
      { name: 'Now I Don\'t Hate California After All', duration_ms: 265093, track_number: 6 },
      { name: 'Heartbeat', duration_ms: 174066, track_number: 7 },
      { name: 'Summer Love', duration_ms: 198653, track_number: 8 },
      { name: 'Solo', duration_ms: 209560, track_number: 9 },
      { name: 'Comeback', duration_ms: 192400, track_number: 10 },
      { name: 'This Is What They Say', duration_ms: 231986, track_number: 11 },
      { name: 'Let\'s Sort the Whole Thing Out', duration_ms: 226760, track_number: 12 }
    ]
  },
  {
    id: '25it89iw2thCgGFVBp1XrQ',
    name: 'Dedicated',
    release_date: '2019-05-17',
    total_tracks: 15,
    images: [
      { url: 'https://i.scdn.co/image/ab67616d0000b273cae26b2a0e0b1a3a6c4d1c4c', height: 640, width: 640 },
      { url: 'https://i.scdn.co/image/ab67616d00001e02cae26b2a0e0b1a3a6c4d1c4c', height: 300, width: 300 },
      { url: 'https://i.scdn.co/image/ab67616d00004851cae26b2a0e0b1a3a6c4d1c4c', height: 64, width: 64 }
    ],
    popularity: 58,
    tracks: [
      { name: 'Julien', duration_ms: 217080, track_number: 1 },
      { name: 'No Drug Like Me', duration_ms: 193733, track_number: 2 },
      { name: 'Now That I Found You', duration_ms: 204720, track_number: 3 },
      { name: 'Want You in My Room', duration_ms: 218093, track_number: 4 },
      { name: 'Everything He Needs', duration_ms: 223106, track_number: 5 },
      { name: 'Happy Not Knowing', duration_ms: 231506, track_number: 6 },
      { name: 'Too Much', duration_ms: 196706, track_number: 7 },
      { name: 'The Sound', duration_ms: 208693, track_number: 8 },
      { name: 'Automatically in Love', duration_ms: 224946, track_number: 9 },
      { name: 'Feels Right', duration_ms: 244040, track_number: 10 },
      { name: 'Right Words Wrong Time', duration_ms: 249906, track_number: 11 },
      { name: 'Real Love', duration_ms: 206066, track_number: 12 },
      { name: 'For Sure', duration_ms: 222400, track_number: 13 },
      { name: 'Party for One', duration_ms: 228093, track_number: 14 },
      { name: 'Dedicated', duration_ms: 208920, track_number: 15 }
    ]
  },
  {
    id: '1DFixLWuPkv3KT3TnV35m3',
    name: 'E\u00B7MO\u00B7TION Side B',
    release_date: '2016-08-26',
    total_tracks: 8,
    images: [
      { url: 'https://i.scdn.co/image/ab67616d0000b27388e3822ab0379c4c8f560597', height: 640, width: 640 },
      { url: 'https://i.scdn.co/image/ab67616d00001e0288e3822ab0379c4c8f560597', height: 300, width: 300 },
      { url: 'https://i.scdn.co/image/ab67616d0000485188e3822ab0379c4c8f560597', height: 64, width: 64 }
    ],
    popularity: 50,
    tracks: [
      { name: 'First Time', duration_ms: 197573, track_number: 1 },
      { name: 'Higher', duration_ms: 215280, track_number: 2 },
      { name: 'The One', duration_ms: 218573, track_number: 3 },
      { name: 'Fever', duration_ms: 209453, track_number: 4 },
      { name: 'Body Language', duration_ms: 217093, track_number: 5 },
      { name: 'Cry', duration_ms: 289546, track_number: 6 },
      { name: 'Store', duration_ms: 231200, track_number: 7 },
      { name: 'Roses', duration_ms: 244053, track_number: 8 }
    ]
  },
  {
    id: '6UjZgFbK6CQptu8aKFJOUB',
    name: 'E\u00B7MO\u00B7TION',
    release_date: '2015-06-24',
    total_tracks: 15,
    images: [
      { url: 'https://i.scdn.co/image/ab67616d0000b27339dbc8a5b3c9a1baf01f9b13', height: 640, width: 640 },
      { url: 'https://i.scdn.co/image/ab67616d00001e0239dbc8a5b3c9a1baf01f9b13', height: 300, width: 300 },
      { url: 'https://i.scdn.co/image/ab67616d0000485139dbc8a5b3c9a1baf01f9b13', height: 64, width: 64 }
    ],
    popularity: 65,
    tracks: [
      { name: 'Run Away with Me', duration_ms: 254320, track_number: 1 },
      { name: 'E\u00B7MO\u00B7TION', duration_ms: 199240, track_number: 2 },
      { name: 'I Really Like You', duration_ms: 197666, track_number: 3 },
      { name: 'Gimmie Love', duration_ms: 217573, track_number: 4 },
      { name: 'All That', duration_ms: 227880, track_number: 5 },
      { name: 'Boy Problems', duration_ms: 207853, track_number: 6 },
      { name: 'Making the Most of the Night', duration_ms: 235546, track_number: 7 },
      { name: 'Your Type', duration_ms: 233173, track_number: 8 },
      { name: 'Let\'s Get Lost', duration_ms: 205800, track_number: 9 },
      { name: 'LA Hallucinations', duration_ms: 220893, track_number: 10 },
      { name: 'Warm Blood', duration_ms: 247760, track_number: 11 },
      { name: 'When I Needed You', duration_ms: 228586, track_number: 12 },
      { name: 'Black Heart', duration_ms: 226360, track_number: 13 },
      { name: 'I Didn\'t Just Come Here to Dance', duration_ms: 222693, track_number: 14 },
      { name: 'Favourite Colour', duration_ms: 220653, track_number: 15 }
    ]
  },
  {
    id: '6YYIW6GSI5hvyMNOnPdDAE',
    name: 'Kiss',
    release_date: '2012-09-18',
    total_tracks: 12,
    images: [
      { url: 'https://i.scdn.co/image/ab67616d0000b273a1c37f3fd969287c9c3bd927', height: 640, width: 640 },
      { url: 'https://i.scdn.co/image/ab67616d00001e02a1c37f3fd969287c9c3bd927', height: 300, width: 300 },
      { url: 'https://i.scdn.co/image/ab67616d00004851a1c37f3fd969287c9c3bd927', height: 64, width: 64 }
    ],
    popularity: 56,
    tracks: [
      { name: 'Tiny Little Bows', duration_ms: 197466, track_number: 1 },
      { name: 'This Kiss', duration_ms: 200573, track_number: 2 },
      { name: 'Call Me Maybe', duration_ms: 193160, track_number: 3 },
      { name: 'Curiosity', duration_ms: 179960, track_number: 4 },
      { name: 'Good Time', duration_ms: 205906, track_number: 5 },
      { name: 'More Than a Memory', duration_ms: 212826, track_number: 6 },
      { name: 'Turn Me Up', duration_ms: 227613, track_number: 7 },
      { name: 'Hurt So Good', duration_ms: 197280, track_number: 8 },
      { name: 'Beautiful', duration_ms: 197186, track_number: 9 },
      { name: 'Tonight I\'m Getting Over You', duration_ms: 195106, track_number: 10 },
      { name: 'Guitar String / Wedding Ring', duration_ms: 195653, track_number: 11 },
      { name: 'Your Heart Is a Muscle', duration_ms: 212720, track_number: 12 }
    ]
  }
];

// ============================================================
// Generate track IDs (consistent within the project)
// ============================================================

// Generate a deterministic mock track ID from album ID + track number
function makeTrackId(albumId, trackNumber) {
  // Use a simple scheme: first 8 chars of album ID + track number
  return 'trk_' + albumId.substring(0, 8) + '_' + String(trackNumber).padStart(2, '0');
}

// ============================================================
// Filler Artists (for search carousel)
// ============================================================

var FILLER_ARTISTS = [
  { id: 'filler_artist_01', name: 'Taylor Swift', popularity: 95, genres: ['pop'], followers: 85000000 },
  { id: 'filler_artist_02', name: 'Ariana Grande', popularity: 90, genres: ['pop', 'r&b'], followers: 78000000 },
  { id: 'filler_artist_03', name: 'Dua Lipa', popularity: 88, genres: ['dance pop', 'pop'], followers: 52000000 },
  { id: 'filler_artist_04', name: 'Billie Eilish', popularity: 89, genres: ['pop', 'electropop'], followers: 65000000 },
  { id: 'filler_artist_05', name: 'Olivia Rodrigo', popularity: 87, genres: ['pop', 'pop rock'], followers: 40000000 },
  { id: 'filler_artist_06', name: 'Charli XCX', popularity: 80, genres: ['dance pop', 'electropop'], followers: 12000000 },
  { id: 'filler_artist_07', name: 'Lorde', popularity: 75, genres: ['art pop', 'pop'], followers: 15000000 },
  { id: 'filler_artist_08', name: 'CHVRCHES', popularity: 65, genres: ['electropop', 'synthpop'], followers: 3000000 },
  { id: 'filler_artist_09', name: 'Tegan and Sara', popularity: 58, genres: ['indie pop', 'pop'], followers: 2000000 }
];

// ============================================================
// Generation Logic
// ============================================================

function getSortedArtistsByName(searchTerm, artists) {
  return artists.map(artist => {
    const nameSimilarity = calculateNameSimilarity(searchTerm, artist.name);
    return { ...artist, nameSimilarity };
  }).sort((a, b) => b.nameSimilarity - a.nameSimilarity)
    .slice(0, 10); // 返回前10个艺术家
}

function calculateNameSimilarity(searchTerm, artistName) {
  // 一个简单的相似性算法示例，可以更精确地替换为字符串相似度算法
  return artistName.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0;
}

function generateMockData() {
  console.log('Generating mock data...\n');

  // 1. Profile data (/me)
  saveJSON(path.join(dataDir, 'me.json'), {
    display_name: 'CS Student',
    external_urls: { spotify: 'https://open.spotify.com/user/cs_student' },
    images: [
      { url: 'https://via.placeholder.com/300x300.png?text=User', height: 300, width: 300 }
    ],
    id: 'cs_student',
    type: 'user',
    uri: 'spotify:user:cs_student'
  });

  // 2. CRJ full artist data
  saveJSON(path.join(dataDir, 'artists', CRJ_ID + '.json'), CRJ_ARTIST_FULL);

  // 3. CRJ albums list (artist-albums endpoint format)
  var albumItems = ALBUMS.map(function(album) {
    return {
      album_type: 'album',
      artists: [CRJ_ARTIST_SIMPLIFIED],
      external_urls: { spotify: 'https://open.spotify.com/album/' + album.id },
      id: album.id,
      images: album.images,
      name: album.name,
      release_date: album.release_date,
      total_tracks: album.total_tracks,
      type: 'album',
      uri: 'spotify:album:' + album.id
    };
  });

  saveJSON(path.join(dataDir, 'artist-albums', CRJ_ID + '.json'), {
    items: albumItems,
    total: albumItems.length,
    limit: 50,
    offset: 0
  });

  // 4. Individual album data + album tracks
  var allTracks = []; // Collect all tracks for search results

  ALBUMS.forEach(function(album) {
    var albumSimplified = {
      album_type: 'album',
      artists: [CRJ_ARTIST_SIMPLIFIED],
      external_urls: { spotify: 'https://open.spotify.com/album/' + album.id },
      id: album.id,
      images: album.images,
      name: album.name,
      release_date: album.release_date,
      total_tracks: album.total_tracks,
      genres: [],
      type: 'album',
      uri: 'spotify:album:' + album.id
    };

    // Full album object
    var albumFull = Object.assign({}, albumSimplified, {
      popularity: album.popularity,
      genres: [],
      label: 'Interscope Records',
      copyrights: [{ text: 'Interscope Records', type: 'C' }]
    });

    saveJSON(path.join(dataDir, 'albums', album.id + '.json'), albumFull);

    // Album tracks
    var trackItems = album.tracks.map(function(track) {
      var trackId = makeTrackId(album.id, track.track_number);

      // Full track object for individual lookup
      var fullTrack = {
        name: track.name,
        id: trackId,
        external_urls: { spotify: 'https://open.spotify.com/track/' + trackId },
        popularity: Math.floor(Math.random() * 40) + 30,
        duration_ms: track.duration_ms,
        disc_number: 1,
        track_number: track.track_number,
        explicit: false,
        artists: [CRJ_ARTIST_SIMPLIFIED],
        album: albumSimplified,
        type: 'track',
        uri: 'spotify:track:' + trackId
      };

      // Save individual track file
      saveJSON(path.join(dataDir, 'tracks', trackId + '.json'), fullTrack);

      allTracks.push(fullTrack);

      // Simplified track for album-tracks endpoint (no album, no images)
      return {
        name: track.name,
        id: trackId,
        external_urls: { spotify: 'https://open.spotify.com/track/' + trackId },
        duration_ms: track.duration_ms,
        disc_number: 1,
        track_number: track.track_number,
        explicit: false,
        artists: [CRJ_ARTIST_SIMPLIFIED],
        type: 'track',
        uri: 'spotify:track:' + trackId
      };
    });

    saveJSON(path.join(dataDir, 'album-tracks', album.id + '.json'), {
      items: trackItems,
      total: trackItems.length,
      limit: 50,
      offset: 0
    });
  });

  // 5. Top tracks - pick 10 notable tracks
  var topTrackNames = [
    'Call Me Maybe', 'I Really Like You', 'Run Away with Me',
    'Good Time', 'Now That I Found You', 'Too Much',
    'Want You in My Room', 'Party for One', 'Western Wind',
    'Cut to the Feeling'
  ];

  // Find matching tracks or use first 10
  var topTracks = [];
  topTrackNames.forEach(function(name) {
    var found = allTracks.find(function(t) { return t.name === name; });
    if (found) {
      // Set higher popularity for top tracks
      var topTrack = Object.assign({}, found, { popularity: Math.floor(Math.random() * 20) + 70 });
      topTracks.push(topTrack);
      // Update individual track file with higher popularity
      saveJSON(path.join(dataDir, 'tracks', found.id + '.json'), topTrack);
    }
  });

  // If we don't have enough, pad with other tracks
  if (topTracks.length < 10) {
    allTracks.forEach(function(t) {
      if (topTracks.length < 10 && !topTracks.find(function(tt) { return tt.id === t.id; })) {
        topTracks.push(t);
      }
    });
  }

  // "Cut to the Feeling" isn't on a standard album, add it manually
  var cutToTheFeeling = {
    name: 'Cut to the Feeling',
    id: 'trk_cut_to_the_feeling',
    external_urls: { spotify: 'https://open.spotify.com/track/trk_cut_to_the_feeling' },
    popularity: 75,
    duration_ms: 207905,
    disc_number: 1,
    track_number: 1,
    explicit: false,
    artists: [CRJ_ARTIST_SIMPLIFIED],
    album: {
      album_type: 'single',
      artists: [CRJ_ARTIST_SIMPLIFIED],
      external_urls: { spotify: 'https://open.spotify.com/album/single_cut_to_the_feeling' },
      id: 'single_cut_to_the_feeling',
      images: CRJ_IMAGES,
      name: 'Cut to the Feeling',
      release_date: '2017-05-26',
      total_tracks: 1,
      type: 'album',
      uri: 'spotify:album:single_cut_to_the_feeling'
    },
    type: 'track',
    uri: 'spotify:track:trk_cut_to_the_feeling'
  };

  saveJSON(path.join(dataDir, 'tracks', 'trk_cut_to_the_feeling.json'), cutToTheFeeling);

  // Replace or add Cut to the Feeling in top tracks
  var ctfIndex = topTracks.findIndex(function(t) { return t.name === 'Cut to the Feeling'; });
  if (ctfIndex === -1) {
    if (topTracks.length >= 10) topTracks.pop();
    topTracks.push(cutToTheFeeling);
  } else {
    topTracks[ctfIndex] = cutToTheFeeling;
  }

  saveJSON(path.join(dataDir, 'artist-top-tracks', CRJ_ID + '.json'), {
    tracks: topTracks
  });

  // 6. Search results

  // Artist search - CRJ first, then filler artists
  var artistSearchItems = [CRJ_ARTIST_FULL];
  FILLER_ARTISTS.forEach(function(fa) {
    artistSearchItems.push({
      name: fa.name,
      id: fa.id,
      external_urls: { spotify: 'https://open.spotify.com/artist/' + fa.id },
      images: [
        { url: 'https://via.placeholder.com/640x640.png?text=' + encodeURIComponent(fa.name), height: 640, width: 640 }
      ],
      popularity: fa.popularity,
      genres: fa.genres,
      followers: { total: fa.followers },
      type: 'artist',
      uri: 'spotify:artist:' + fa.id
    });
  });

  saveJSON(path.join(dataDir, 'search', 'artist.json'), {
    artists: {
      items: artistSearchItems,
      total: artistSearchItems.length,
      limit: 20,
      offset: 0
    }
  });

  // Album search - CRJ albums plus fillers
  var albumSearchItems = albumItems.slice();
  // Add a few filler albums
  var fillerAlbums = [
    { id: 'filler_album_01', name: 'Midnights', artist: 'Taylor Swift', artistId: 'filler_artist_01' },
    { id: 'filler_album_02', name: 'Eternal Sunshine', artist: 'Ariana Grande', artistId: 'filler_artist_02' },
    { id: 'filler_album_03', name: 'Future Nostalgia', artist: 'Dua Lipa', artistId: 'filler_artist_03' },
    { id: 'filler_album_04', name: 'Happier Than Ever', artist: 'Billie Eilish', artistId: 'filler_artist_04' },
    { id: 'filler_album_05', name: 'SOUR', artist: 'Olivia Rodrigo', artistId: 'filler_artist_05' }
  ];

  fillerAlbums.forEach(function(fa) {
    albumSearchItems.push({
      album_type: 'album',
      artists: [{
        name: fa.artist,
        id: fa.artistId,
        external_urls: { spotify: 'https://open.spotify.com/artist/' + fa.artistId },
        type: 'artist',
        uri: 'spotify:artist:' + fa.artistId
      }],
      external_urls: { spotify: 'https://open.spotify.com/album/' + fa.id },
      id: fa.id,
      images: [
        { url: 'https://via.placeholder.com/640x640.png?text=' + encodeURIComponent(fa.name), height: 640, width: 640 }
      ],
      name: fa.name,
      release_date: '2023-01-01',
      total_tracks: 12,
      type: 'album',
      uri: 'spotify:album:' + fa.id
    });
  });

  saveJSON(path.join(dataDir, 'search', 'album.json'), {
    albums: {
      items: albumSearchItems,
      total: albumSearchItems.length,
      limit: 20,
      offset: 0
    }
  });

  // Track search - top CRJ tracks plus fillers
  var trackSearchItems = topTracks.slice();
  var fillerTracks = [
    { id: 'filler_track_01', name: 'Anti-Hero', artist: 'Taylor Swift', artistId: 'filler_artist_01', albumName: 'Midnights', albumId: 'filler_album_01', duration_ms: 200690 },
    { id: 'filler_track_02', name: 'We Can\'t Be Friends', artist: 'Ariana Grande', artistId: 'filler_artist_02', albumName: 'Eternal Sunshine', albumId: 'filler_album_02', duration_ms: 215120 },
    { id: 'filler_track_03', name: 'Levitating', artist: 'Dua Lipa', artistId: 'filler_artist_03', albumName: 'Future Nostalgia', albumId: 'filler_album_03', duration_ms: 203066 },
    { id: 'filler_track_04', name: 'Bad Guy', artist: 'Billie Eilish', artistId: 'filler_artist_04', albumName: 'Happier Than Ever', albumId: 'filler_album_04', duration_ms: 194088 },
    { id: 'filler_track_05', name: 'Drivers License', artist: 'Olivia Rodrigo', artistId: 'filler_artist_05', albumName: 'SOUR', albumId: 'filler_album_05', duration_ms: 242013 }
  ];

  fillerTracks.forEach(function(ft) {
    trackSearchItems.push({
      name: ft.name,
      id: ft.id,
      external_urls: { spotify: 'https://open.spotify.com/track/' + ft.id },
      popularity: 80,
      duration_ms: ft.duration_ms,
      disc_number: 1,
      track_number: 1,
      explicit: false,
      artists: [{
        name: ft.artist,
        id: ft.artistId,
        external_urls: { spotify: 'https://open.spotify.com/artist/' + ft.artistId },
        type: 'artist',
        uri: 'spotify:artist:' + ft.artistId
      }],
      album: {
        album_type: 'album',
        artists: [{
          name: ft.artist,
          id: ft.artistId,
          external_urls: { spotify: 'https://open.spotify.com/artist/' + ft.artistId },
          type: 'artist',
          uri: 'spotify:artist:' + ft.artistId
        }],
        external_urls: { spotify: 'https://open.spotify.com/album/' + ft.albumId },
        id: ft.albumId,
        images: [
          { url: 'https://via.placeholder.com/640x640.png?text=' + encodeURIComponent(ft.albumName), height: 640, width: 640 }
        ],
        name: ft.albumName,
        release_date: '2023-01-01',
        total_tracks: 12,
        genres: [],
        type: 'album',
        uri: 'spotify:album:' + ft.albumId
      },
      type: 'track',
      uri: 'spotify:track:' + ft.id
    });
  });

  saveJSON(path.join(dataDir, 'search', 'track.json'), {
    tracks: {
      items: trackSearchItems,
      total: trackSearchItems.length,
      limit: 20,
      offset: 0
    }
  });

  // 7. Unknown fallback data
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
    artists: [{
      name: 'Unknown Artist',
      id: 'unknown',
      external_urls: { spotify: 'https://open.spotify.com' },
      type: 'artist',
      uri: 'spotify:artist:unknown'
    }],
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
    artists: [{
      name: 'Unknown Artist',
      id: 'unknown',
      external_urls: { spotify: 'https://open.spotify.com' },
      type: 'artist',
      uri: 'spotify:artist:unknown'
    }],
    album: {
      name: 'Unknown Album',
      id: 'unknown',
      images: [],
      external_urls: { spotify: 'https://open.spotify.com' },
      genres: [],
      artists: [{
        name: 'Unknown Artist',
        id: 'unknown',
        external_urls: { spotify: 'https://open.spotify.com' },
        type: 'artist',
        uri: 'spotify:artist:unknown'
      }],
      type: 'album',
      uri: 'spotify:album:unknown'
    },
    type: 'track',
    uri: 'spotify:track:unknown'
  });

  console.log('\nDone! Generated mock data for:');
  console.log('  - 1 user profile');
  console.log('  - 1 artist (Carly Rae Jepsen) with full data');
  console.log('  - ' + ALBUMS.length + ' albums with track listings');
  console.log('  - ' + allTracks.length + ' individual tracks');
  console.log('  - Search results for artist/album/track');
  console.log('  - Unknown fallback data for all types');
  console.log('\nStart the server with: npm start');
}

generateMockData();
