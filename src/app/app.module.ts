import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PlaylistMakerComponent } from './playlist-maker/playlist-maker.component';
import { PlaylistMakerService } from './playlist-maker/playlist-maker.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlaylistMakerComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    PlaylistMakerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
