var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

var client_uri = 'http://localhost:4200';
var dataDir = path.join(__dirname, '..', 'data');

// ============================================================
// Search Index (built on first search from saved data files)
// ============================================================

var searchIndex = { artists: [], albums: [], tracks: [] };
var indexBuilt = false;

/**
 * Calculate similarity score between search query and text
 * Higher score = better match
 */
function calculateSimilarity(query, text) {
  var queryLower = query.toLowerCase();
  var textLower = text.toLowerCase();
  
  // Exact match gets highest score
  if (textLower === queryLower) return 10000;
  
  // Starts with query gets high score
  if (textLower.startsWith(queryLower)) {
    // Longer match relative to text length = higher score
    var ratio = queryLower.length / textLower.length;
    return 5000 + Math.floor(ratio * 1000);
  }
  
  // Contains query - score based on position (earlier = better)
  var index = textLower.indexOf(queryLower);
  if (index >= 0) {
    // Earlier position and longer match = higher score
    var positionScore = 1000 - (index * 10);
    var lengthRatio = queryLower.length / textLower.length;
    return Math.max(100, positionScore + Math.floor(lengthRatio * 500));
  }
  
  // No match gets very low score (still include in results)
  return 1;
}

/**
 * Calculate fuzzy text similarity between query and text
 * Returns a score based on character overlap and substring matches
 */
function calculateFuzzySimilarity(query, text) {
  var queryLower = query.toLowerCase();
  var textLower = text.toLowerCase();
  
  if (!queryLower || !textLower) return 0;
  
  var score = 0;
  
  // Check for any character overlap
  var queryChars = queryLower.split('');
  var textChars = textLower.split('');
  var matchedChars = 0;
  
  for (var i = 0; i < queryChars.length; i++) {
    if (textLower.indexOf(queryChars[i]) >= 0) {
      matchedChars++;
    }
  }
  
  // Character overlap score (0-100 points)
  score += (matchedChars / queryChars.length) * 100;
  
  // Check for word matches (split by space and check each word)
  var queryWords = queryLower.split(/\s+/);
  var textWords = textLower.split(/\s+/);
  var wordMatches = 0;
  
  for (var j = 0; j < queryWords.length; j++) {
    for (var k = 0; k < textWords.length; k++) {
      if (textWords[k].indexOf(queryWords[j]) >= 0 || queryWords[j].indexOf(textWords[k]) >= 0) {
        wordMatches++;
        break;
      }
    }
  }
  
  // Word match score (0-200 points)
  if (queryWords.length > 0) {
    score += (wordMatches / queryWords.length) * 200;
  }
  
  return score;
}

function buildSearchIndex() {
  if (indexBuilt) return;
  console.log('Building search index...');

  // Index artists
  var artistsDir = path.join(dataDir, 'artists');
  if (fs.existsSync(artistsDir)) {
    fs.readdirSync(artistsDir).forEach(function(file) {
      if (!file.endsWith('.json')) return;
      try {
        var data = JSON.parse(fs.readFileSync(path.join(artistsDir, file), 'utf8'));
        searchIndex.artists.push({ data: data, name_lower: (data.name || '').toLowerCase() });
      } catch (e) {}
    });
  }
  searchIndex.artists.sort(function(a, b) { return (b.data.popularity || 0) - (a.data.popularity || 0); });

  // Index albums (searchable by album name + artist names)
  var albumsDir = path.join(dataDir, 'albums');
  if (fs.existsSync(albumsDir)) {
    fs.readdirSync(albumsDir).forEach(function(file) {
      if (!file.endsWith('.json')) return;
      try {
        var data = JSON.parse(fs.readFileSync(path.join(albumsDir, file), 'utf8'));
        var text = (data.name || '').toLowerCase();
        if (data.artists) data.artists.forEach(function(a) { text += ' ' + (a.name || '').toLowerCase(); });
        searchIndex.albums.push({ data: data, search_text: text });
      } catch (e) {}
    });
  }
  searchIndex.albums.sort(function(a, b) { return (b.data.popularity || 0) - (a.data.popularity || 0); });

  // Index tracks (searchable by track name + artist names + album name)
  var tracksDir = path.join(dataDir, 'tracks');
  if (fs.existsSync(tracksDir)) {
    fs.readdirSync(tracksDir).forEach(function(file) {
      if (!file.endsWith('.json')) return;
      try {
        var data = JSON.parse(fs.readFileSync(path.join(tracksDir, file), 'utf8'));
        var text = (data.name || '').toLowerCase();
        if (data.artists) data.artists.forEach(function(a) { text += ' ' + (a.name || '').toLowerCase(); });
        if (data.album) text += ' ' + (data.album.name || '').toLowerCase();
        searchIndex.tracks.push({ data: data, search_text: text });
      } catch (e) {}
    });
  }
  searchIndex.tracks.sort(function(a, b) { return (b.data.popularity || 0) - (a.data.popularity || 0); });

  indexBuilt = true;
  console.log('Search index: ' + searchIndex.artists.length + ' artists, ' +
    searchIndex.albums.length + ' albums, ' + searchIndex.tracks.length + ' tracks');
}

// ============================================================
// Helpers
// ============================================================

function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return null;
  }
}

// ============================================================
// Routes
// ============================================================

/**
 * /login - Just redirect back to client. No auth needed.
 */
router.get('/login', function(req, res) {
  res.redirect(client_uri);
});

/**
 * /callback - Just redirect back to client.
 */
router.get('/callback', function(req, res) {
  res.redirect(client_uri);
});

/**
 * /me - Return saved user profile data.
 */
router.get('/me', function(req, res) {
  var data = loadJSON(path.join(dataDir, 'me.json'));
  if (data) {
    res.json(data);
  } else {
    res.json({
      display_name: 'Student User',
      external_urls: { spotify: 'https://open.spotify.com' },
      images: [],
      id: 'student_user',
      type: 'user',
      uri: 'spotify:user:student_user'
    });
  }
});

/**
 * /search/:category/:resource - Dynamic search through saved data.
 * Filters by name matching the query string (case-insensitive).
 */
router.get('/search/:category/:resource', function(req, res) {
  buildSearchIndex();

  var category = req.params.category;
  var query = decodeURIComponent(req.params.resource).toLowerCase().trim();
  var limit = 20;

  // Safety check: ensure searchIndex is properly initialized
  if (!searchIndex.artists) searchIndex.artists = [];
  if (!searchIndex.albums) searchIndex.albums = [];
  if (!searchIndex.tracks) searchIndex.tracks = [];

  if (category === 'artist') {
    // Calculate similarity scores for all artists
    var artistsWithScores = searchIndex.artists.map(function(e) {
      return {
        data: e.data,
        similarityScore: calculateSimilarity(query, (e.data && e.data.name) || '')
      };
    }).filter(function(e) {
      return e.data; // Only include items with valid data
    });
    
    // Safety net: if we don't have enough results, ensure we have data to return
    if (artistsWithScores.length === 0 && searchIndex.artists.length > 0) {
      // If no valid scores, use all artists
      artistsWithScores = searchIndex.artists.map(function(e) {
        return {
          data: e.data,
          similarityScore: 1
        };
      }).filter(function(e) { return e.data; });
    }
    
    // Sort by similarity score (highest first), with popularity as minor factor
    // High matches will naturally appear first due to higher similarity scores
    artistsWithScores.sort(function(a, b) {
      // Popularity adds a small bonus (max 99 points) to avoid overwhelming similarity
      var scoreA = a.similarityScore + ((a.data.popularity || 0) / 100) * 99;
      var scoreB = b.similarityScore + ((b.data.popularity || 0) / 100) * 99;
      return scoreB - scoreA;
    });
    
    // Return top 10 artists (or all if less than 10)
    var topArtists = artistsWithScores.slice(0, 10);
    var artistItems = topArtists.map(function(e) { return e.data; }).filter(function(d) { return d; });
    res.json({ artists: { items: artistItems, total: artistItems.length, limit: 10, offset: 0 } });
    
  } else if (category === 'album') {
    // Calculate similarity scores for all albums
    var albumsWithScores = searchIndex.albums.map(function(e) {
      return {
        data: e.data,
        similarityScore: calculateSimilarity(query, e.search_text || '')
      };
    }).filter(function(e) {
      return e.data; // Only include items with valid data
    });
    
    // Safety net: if we don't have enough results, ensure we have data to return
    if (albumsWithScores.length === 0 && searchIndex.albums.length > 0) {
      // If no valid scores, use all albums
      albumsWithScores = searchIndex.albums.map(function(e) {
        return {
          data: e.data,
          similarityScore: 1
        };
      }).filter(function(e) { return e.data; });
    }
    
    // Sort by similarity score (highest first), with popularity as minor factor
    albumsWithScores.sort(function(a, b) {
      // Popularity adds a small bonus (max 99 points) to avoid overwhelming similarity
      var scoreA = a.similarityScore + ((a.data.popularity || 0) / 100) * 99;
      var scoreB = b.similarityScore + ((b.data.popularity || 0) / 100) * 99;
      return scoreB - scoreA;
    });
    
    // Return top 10 albums (or all if less than 10)
    var topAlbums = albumsWithScores.slice(0, 10);
    var albumItems = topAlbums.map(function(e) { return e.data; }).filter(function(d) { return d; });
    res.json({ albums: { items: albumItems, total: albumItems.length, limit: 10, offset: 0 } });
    
  } else if (category === 'track') {
    // Calculate similarity scores for all tracks
    console.log(searchIndex.tracks);
    var tracksWithScores = searchIndex.tracks.map(function(e) {
      return {
        data: e.data,
        similarityScore: calculateSimilarity(query, e.search_text || '')
      };
    }).filter(function(e) {
      return e.data; // Only include items with valid data
    });
    
    // Safety net: if we don't have enough results, ensure we have data to return
    if (tracksWithScores.length === 0 && searchIndex.tracks.length > 0) {
      // If no valid scores, use all tracks
      tracksWithScores = searchIndex.tracks.map(function(e) {
        return {
          data: e.data,
          similarityScore: 1
        };
      }).filter(function(e) { return e.data; });
    }
    
    // Sort by similarity score (highest first), with popularity as minor factor
    tracksWithScores.sort(function(a, b) {
      // Popularity adds a small bonus (max 99 points) to avoid overwhelming similarity
      var scoreA = a.similarityScore + ((a.data.popularity || 0) / 100) * 99;
      var scoreB = b.similarityScore + ((b.data.popularity || 0) / 100) * 99;
      return scoreB - scoreA;
    });
    
    // Return top 10 tracks (or all if less than 10)
    var topTracks = tracksWithScores.slice(0, 10);
    var trackItems = topTracks.map(function(e) { return e.data; }).filter(function(d) { return d; });
    res.json({ tracks: { items: trackItems, total: trackItems.length, limit: 10, offset: 0 } });
  } else {
    var result = {};
    result[category + 's'] = { items: [], total: 0, limit: limit, offset: 0 };
    res.json(result);
  }
});

/**
 * /artist/:id - Return artist data. Falls back to "unknown" artist.
 */
router.get('/artist/:id', function(req, res) {
  var id = req.params.id;
  var data = loadJSON(path.join(dataDir, 'artists', id + '.json'));
  if (!data) {
    data = loadJSON(path.join(dataDir, 'unknown', 'artist.json'));
    if (data) {
      // Clone and set the requested ID so the page doesn't crash
      data = JSON.parse(JSON.stringify(data));
      data.id = id;
    }
  }
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'Artist not found' });
  }
});

/**
 * /artist-albums/:id - Return artist's albums.
 */
router.get('/artist-albums/:id', function(req, res) {
  var id = req.params.id;
  var data = loadJSON(path.join(dataDir, 'artist-albums', id + '.json'));
  if (data) {
    res.json(data);
  } else {
    res.json({ items: [] });
  }
});

/**
 * /artist-top-tracks/:id - Return artist's top tracks.
 */
router.get('/artist-top-tracks/:id', function(req, res) {
  var id = req.params.id;
  var data = loadJSON(path.join(dataDir, 'artist-top-tracks', id + '.json'));
  if (data) {
    res.json(data);
  } else {
    res.json({ tracks: [] });
  }
});

/**
 * /album/:id - Return album data. Falls back to "unknown" album.
 */
router.get('/album/:id', function(req, res) {
  var id = req.params.id;
  var data = loadJSON(path.join(dataDir, 'albums', id + '.json'));
  if (!data) {
    data = loadJSON(path.join(dataDir, 'unknown', 'album.json'));
    if (data) {
      data = JSON.parse(JSON.stringify(data));
      data.id = id;
    }
  }
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'Album not found' });
  }
});

/**
 * /album-tracks/:id - Return tracks for an album.
 */
router.get('/album-tracks/:id', function(req, res) {
  var id = req.params.id;
  var data = loadJSON(path.join(dataDir, 'album-tracks', id + '.json'));
  if (data) {
    res.json(data);
  } else {
    res.json({ items: [] });
  }
});

/**
 * /track/:id - Return track data. Falls back to "unknown" track.
 */
router.get('/track/:id', function(req, res) {
  var id = req.params.id;
  var data = loadJSON(path.join(dataDir, 'tracks', id + '.json'));
  if (!data) {
    data = loadJSON(path.join(dataDir, 'unknown', 'track.json'));
    if (data) {
      data = JSON.parse(JSON.stringify(data));
      data.id = id;
    }
  }
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'Track not found' });
  }
});

module.exports = router;
