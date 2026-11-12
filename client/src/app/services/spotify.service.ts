import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://127.0.0.1:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    //Specifically, update the URI according to the base URL for express and the endpoint.
    var uri:string = this.expressBaseUrl + endpoint;

    //firstValueFrom generates a Promise for whatever is returned first from the GET request.
    //You shouldn't need to update this part.
    return firstValueFrom(this.http.get(uri)).then((response) => {
      return response;
    }, (err) => {
      return err;
    });
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //Fetches a response from webserver, depending on the category builds a array of that type of object
    return this.sendRequestToExpress('/search/' + category + '/' + encodeURIComponent(resource)).then((response) => {
      if (category == "artist") {
        var artists: ArtistData[] = [];
        for (let artist of response.artists.items) {artists.push(new ArtistData(artist))}
        return artists;
      }
      else if (category == 'track') {
        var tracks: TrackData[] = [];
        for (let track of response.tracks.items) {tracks.push(new TrackData(track))}
        return tracks;
      }
      else if (category == 'album') {
        var albums: AlbumData[] = [];
        for (let album of response.albums.items) {albums.push(new AlbumData(album))}
        return albums;
      }
      else
        return [];
    })
}


  getArtist(artistId:string):Promise<ArtistData> {
    //Fetches response from server and uses it to return a ArtistData object.
    return this.sendRequestToExpress('/artist/' + encodeURIComponent(artistId)).then((response) => {return new ArtistData(response)});
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //Fetches response from server and creates an array of tracks
    return this.sendRequestToExpress('/artist-top-tracks/' + encodeURIComponent(artistId)).then((response) => {
      var tracks: TrackData[] = [];
      for (let track of response.tracks) {tracks.push(new TrackData(track))}
      return tracks;
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //Fetches response from server and creates an array of albums
    return this.sendRequestToExpress('/artist-albums/' + encodeURIComponent(artistId)).then((response) => {
      var albums: AlbumData[] = [];
      for (let album of response.items) {albums.push(new AlbumData(album))}
      return albums;
    });
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //Fetches response from server and returns an album
    return this.sendRequestToExpress('/album/' + encodeURIComponent(albumId)).then((response) => {return new AlbumData(response)});
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //Fetches response from server and returns a list of tracks
    return this.sendRequestToExpress('/album-tracks/' + encodeURIComponent(albumId)).then((response) => {
      var tracks: TrackData[] = [];
      for (let track of response.items) {tracks.push(new TrackData(track))}
      return tracks;
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    //Fetches response from server and a track
    return this.sendRequestToExpress('/track/' + encodeURIComponent(trackId)).then((response) => {return new TrackData(response)});
  }
}