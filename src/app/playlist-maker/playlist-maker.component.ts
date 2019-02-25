import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getToken } from '@angular/router/src/utils/preactivation';
import { HttpClient } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';

import { PlaylistMakerService } from './playlist-maker.service';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { TestBed, async } from '@angular/core/testing';

@Component({
  selector: 'app-playlist-maker',
  templateUrl: './playlist-maker.component.html',
  styleUrls: ['./playlist-maker.component.css']
})
export class PlaylistMakerComponent implements OnInit {

  // Spotify Acct Top Tracks
  restItems: any;  
  genreList: string[] = [];

  // Google Maps
  travelTime: string;
  timeMs: number;
  mapsRestItems: any;
  dest: string;

  //Spotify Rec
  recsRestItems: any;
  playlist: any[] = [];

  // User Rest
  userRestItems: any;
  userID: string;
  createdPlaylist: any;
  trackPlaylist: any;
  tracklist: any;
  test: any;

  constructor(private router: Router, private http: HttpClient, private plMake: PlaylistMakerService) { }

  ngOnInit() {
    this.getRestItems();    
  }

  // 
  getTravelTime(origin:string, dest:string): void{
    this.tracklist = true;
    this.dest = dest;
    this.plMake.getTime(origin, dest).subscribe(
      mapsRestItems => {
        this.mapsRestItems = mapsRestItems;   
        this.travelTime = this.mapsRestItems['rows']['0']['elements']['0']['duration_in_traffic']['text'];
        this.timeMs = this.plMake.stringToNum(this.mapsRestItems['rows']['0']['elements']['0']['duration_in_traffic']['text']);
        this.getReccomendations();
      }
    )
  }

  // get users top 10 artists
  getRestItems():void {
    this.plMake.getRecSeed().subscribe(
      restItems => { 
        this.restItems = restItems;
        this.getArtists(restItems);
      }
    )    
  }  

  // Generate Reccomendations
  getReccomendations():void{
    this.plMake.getRecs( this.timeMs, this.genreList ).subscribe(
      recsRestItems => {
        this.recsRestItems = recsRestItems;
        this.makePlaylist();        
      }
    )
  }

  // Create PlayList using song generator from artistID
  makePlaylist() {
    for(let track of this.recsRestItems.tracks) {  

      if (track != undefined){        
        this.timeMs -= track.duration_ms;
        this.playlist.push(track);
      }
      if (this.timeMs <= 0) {
        this.createPlaylist();
        break;
      }
    }
    if (this.timeMs > 0) {
      this.getReccomendations();
    }
  }

  // Create PlayList in user spotify Account
  createPlaylist() {
    this.plMake.getUserId().subscribe(    // Get User Id
      userRestItems => {
        this.userRestItems = userRestItems;
        this.plMake.createPlaylist(this.userRestItems.id, this.dest).subscribe(   // Create Playlist
          createdPlaylist => {
            this.createdPlaylist = createdPlaylist;            
            this.addPlaylist();         
            setTimeout(() =>        // Wait For Spotify Servers to create Playlist from post request
            {
              this.showPlaylist();
            },
            2000);   
          }
        );
      }
    );
  }

  // Add songs to playlist in user's account
  addPlaylist() {
    // Load songs 100 at a time
    while (this.playlist.length > 1){
      this.plMake.addPlaylist(this.playlist.splice(0,100), this.createdPlaylist['id']).subscribe(
        trackPlaylist => {
          this.trackPlaylist = trackPlaylist;
        }
      )
    }    

  }

  showPlaylist() {    
    this.plMake.showPlaylist(this.createdPlaylist['id']).subscribe(
      tracklist => {
        console.log(tracklist);
        this.tracklist = tracklist;
      }
    )
  }

  getArtists(restItems){
    for (let restItem of restItems.items){
      this.genreList.push(restItem.id);    
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

}
