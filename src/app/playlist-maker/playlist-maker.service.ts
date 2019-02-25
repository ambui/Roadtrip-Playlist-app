import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { getToken } from '@angular/router/src/utils/preactivation';
import { OriginalSource } from 'webpack-sources';


@Injectable({
  providedIn: 'root'
})

export class PlaylistMakerService{

  // Spotify
  protected restItemsUrl: string = 'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10&offset=5';
  protected accessToken: string;
  protected artistList: any;

  // Google Maps
  protected mapsRestUrl: string = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?origins=';
  protected mapsRestUrl2: string = '&destinations=';
  protected mapsRestUrl3: string = '&language=en&departure_time=now&key=';
  protected mapsApiKey: string = <GOOGLE MAPS APIKEY>

  //Spotify Recommendations
  protected recsRestUrl: string = 'https://api.spotify.com/v1/recommendations?limit=';
  protected recsRestUrl2: string = '&market=US&seed_artists=';

  // Creating Playlist
  protected userRestUrl: string = 'https://api.spotify.com/v1/me';
  protected newPlaylistUrl: string = 'https://api.spotify.com/v1/users/'
  protected newPlaylistUrl2: string ='/playlists';
  protected addPlaylistUrl: string = 'https://api.spotify.com/v1/playlists/'
  protected addPlaylistUrl2: string = '/tracks';


  constructor(private http: HttpClient, private router: Router) { }

  getRecSeed(){
    this.getToken();
    this.artistList = this.restItemsServiceGetRestItems();
    return this.restItemsServiceGetRestItems();

  }

  // Get access token from URL
  getToken(){      
    var url = this.router.url;
    for (var i = 0; i < url.length; i++){
      if (url.charAt(i) == '='){
        this.accessToken = url.substr(i+1);
        break;
      }
    }
    console.log(this.accessToken);
  }

  // Get Top10 artist from users listening history
  restItemsServiceGetRestItems() {
    return this.http
      .get<any[]>(this.restItemsUrl, { headers: {'Content-type':'application/json', 'Authorization': 'Bearer ' + this.accessToken}})
      .pipe(map(data=>data));
  }

  // string manipulation to append to URL
  stringToParam(str: string, src: string){
    if (src == 'maps') {
      str = str.trim();
      return str = str.replace(/\s/g, "+");
    }
    else if (src = 'recs') {
      str = str.trim();
      return str = str.replace(/\s/g, "%20");
    }
  }

  // Get Travel Time
  getTime( origin: string, dest: string) {
    var distanceUrl = this.mapsRestUrl + this.stringToParam(origin, 'maps') + this.mapsRestUrl2 + this.stringToParam(dest,'maps') + this.mapsRestUrl3 + this.mapsApiKey;
    console.log(distanceUrl);
    return this.http.get<any[]>(distanceUrl)
      .pipe(map(data=>data));
  }

  // get recommendations
  getRecs( timeMs: number, genreList: string[]) {      
    var genreParam = "";    
    for (let genre in genreList) {
      var temp:string = genreList.shift();
      genreParam += this.stringToParam(temp,'recs') + '%2C';
      genreList.push(temp);
      if (parseInt(genre) == 4) {
        break;
      }
    }
    var limit = 100;

    var fullRestUrl = this.recsRestUrl + limit + this.recsRestUrl2 + genreParam;
    return this.http.get<any[]>(fullRestUrl, { headers: {'Content-type':'application/json', 'Authorization': 'Bearer ' + this.accessToken}})
      .pipe(map(data=>data));
  }

  getUserId(){
    // Get user id    
    return this.http.get<any[]>(this.userRestUrl, { headers: {'Content-type':'application/json', 'Authorization': 'Bearer ' + this.accessToken}})
  }

  createPlaylist(userID:string, dest:string){
    // Create New Playlist
    var name: string = 'Roadtrip to ' + dest;
    var fullPlaylistUrl = this.newPlaylistUrl + userID + this.newPlaylistUrl2;
    console.log(fullPlaylistUrl);
    return this.http.post<any[]>(fullPlaylistUrl, {'name':name}, {headers: {'Content-type':'application/json','Authorization': 'Bearer ' + this.accessToken}})
  }

  addPlaylist(playList: any, playlistID: string){
    var uris = this.songBody(playList, playlistID);
    var addUrl = this.addPlaylistUrl + playlistID + this.addPlaylistUrl2;
    return this.http.post<any[]>(addUrl, {'uris': uris}, { headers: {'Content-type':'application/json','Authorization': 'Bearer ' + this.accessToken}})
  }

  songBody(playlist: any, playlistID: string){
    var uris:string[] = [];
    for( let track in playlist) {
      uris.push('spotify:track:' + playlist[track].id);
      if (parseInt(track) > 98) {
        break;
      }
    }
    console.log(uris);
    return uris;
  }

  showPlaylist(playlistID: string) {
    var url = this.addPlaylistUrl + playlistID + this.addPlaylistUrl2;
    return this.http.get<any[]>(url, { headers: {'Content-type':'application/json','Authorization': 'Bearer ' + this.accessToken} });
  }

  stringToNum(str: string){    
    var  timeMs = 0;
    var timeSplit = str.split(" ");
    for (var i = 0; i < timeSplit.length; i=i+2){
      if(timeSplit[i+1] == 'mins'){
        timeMs = timeMs + parseInt(timeSplit[i])*60000;
      }
      if(timeSplit[i+1] == 'hours' || timeSplit[i+1] == 'hour'){
        timeMs = timeMs + parseInt(timeSplit[i])*60000*60;
      }
      if(timeSplit[i+1] == 'days' || timeSplit[i+1] == 'day'){
        timeMs = timeMs + parseInt(timeSplit[i])*60000*60*24;
      }
    }
    console.log(timeMs + ' Ms');
    return timeMs;
  }

}

