import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  authUrl: 'https://accounts.spotify.com/authorize?client_id=78dfed1239b94705ad0899008dca795c&redirect_uri=http:%2F%2Flocalhost:4200%2Fplaylist-maker&scope=user-top-read&response_type=token';

  constructor() { }

  ngOnInit() {
  }

}
