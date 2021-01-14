import {AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {IState, PlayerService} from "../../services/player/player.service";

const fs = window.nw.require('fs');

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, AfterViewInit {
  title = 'cmod4';

  state$: Observable<IState>;

  @ViewChild('inputLoad') inputLoad: ElementRef;

  loadFileChangeListenerFn;
  loadFileClickListenerFn;

  constructor(
    private ngZone: NgZone,
    public playerService: PlayerService
  ) {
    this.state$ = this.playerService.stateObs$;
    // this.playerService.stateObs$.subscribe(a => console.log(a));
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.prepareLoadFileListeners();
  }

  prepareLoadFileListeners() {
    this.loadFileClickListenerFn = this.loadFileClickListener.bind(this);
    this.inputLoad.nativeElement.addEventListener('click', this.loadFileClickListenerFn);
    this.loadFileChangeListenerFn = this.loadFileChangeListener.bind(this);
    this.inputLoad.nativeElement.addEventListener('change', this.loadFileChangeListenerFn);
  }

  loadFileClickListener(e) {
    this.inputLoad.nativeElement.value = '';
  }

  loadFileChangeListener(e) {
    const files = e.target.value.split(';').sort();
    this.loadFile(files[0]); // Load first file, testing...
  }

  //

  loadFile(filePath: string) {

    /*const xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer'; // make response as ArrayBuffer
    xhr.open('GET', filePath,true);
    xhr.send();
    xhr.onload = (event) => {
      const loadedMod = new Int8Array(xhr.response);
      this.playerService.ready$.subscribe((ready) => {
        if (ready) {
          this.playerService.loadSong(loadedMod);
        }
      });
    }*/

    fs.readFile(filePath, (err, data) => {
      if (err) throw err;
      console.log(data);
      const loadedMod = new Int8Array(data);
      this.ngZone.run(() => {
        this.playerService.ready$.subscribe((ready) => {
          if (ready) {
            this.playerService.loadSong(loadedMod);
          }
        })
      });
    });
  }

  // Listeners from template

  load(event: MouseEvent) {
    this.inputLoad.nativeElement.click();
  }

  play(event: MouseEvent) {
    this.playerService.play();
  }

  stop(event: MouseEvent) {
    this.playerService.stop();
  }

}
