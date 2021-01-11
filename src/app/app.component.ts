import { Component, NgZone, OnInit } from '@angular/core';
import {PlayerService} from "./services/player/player.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cmod4';

  modPlayer;

  constructor(
    public ngZone: NgZone,
    private playerService: PlayerService
  ) {
  }

  ngOnInit() {

    var loadedMod;




    var xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer'; // make response as ArrayBuffer
    xhr.open('GET',
      '/assets/radix_-_yuki_satellites.xm'
      , true);

    xhr.send();
    xhr.onload = (event) => {
      console.log(xhr.response);
      loadedMod = new Int8Array(xhr.response);
      console.log(loadedMod);

      this.playerService.$ready.subscribe((ready) => {
        if (ready) {
          this.playerService.loadSong(loadedMod);
        }
      });

    }

  }

  play(event: MouseEvent) {
    this.playerService.play();
  }

}
