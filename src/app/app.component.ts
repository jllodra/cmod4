import { Component, NgZone, OnInit } from '@angular/core';
import {IState, PlayerService} from "./services/player/player.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cmod4';

  state$: Observable<IState>;

  constructor(
    public playerService: PlayerService
  ) {
    this.state$ = this.playerService.stateObs$;
    // this.playerService.stateObs$.subscribe(a => console.log(a));
  }

  ngOnInit() {
    let loadedMod;
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer'; // make response as ArrayBuffer
    xhr.open('GET',
      '/assets/mods/radix_-_yuki_satellites.xm'
      , true);
    xhr.send();
    xhr.onload = (event) => {
      console.log(xhr.response);
      loadedMod = new Int8Array(xhr.response);
      console.log(loadedMod);

      this.playerService.ready$.subscribe((ready) => {
        if (ready) {
          this.playerService.loadSong(loadedMod);
        }
      });
    }
  }

  load(event: MouseEvent) {
    // this.playerService.load();
  }

  play(event: MouseEvent) {
    this.playerService.play();
  }

  stop(event: MouseEvent) {
    this.playerService.stop();
  }

}
