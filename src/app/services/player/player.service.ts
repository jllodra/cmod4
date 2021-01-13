import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

export interface IState {
  loaded: boolean;
  playing: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private readonly context: AudioContext;
  private modPlayer: AudioWorkletNode;
  private state$ = new BehaviorSubject<IState>({
    loaded: false,
    playing: false
  });

  public stateObs$ = this.state$.asObservable();
  public ready$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private ngZone: NgZone) {
    this.context = new AudioContext({
      latencyHint: 'playback'
    });
    this.context.audioWorklet.addModule('/assets/mod-player.js')
      .then(() => {
        console.log('setup');
        this.setupModPlayer();
        this.ready$.next(true);
      });


    this.stateObs$.subscribe((a)=> console.log(a));
  }

  setupModPlayer() {
    this.modPlayer = new AudioWorkletNode(this.context, 'mod-player', {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2]
    });
    this.modPlayer.port.onmessage = this.onMessage.bind(this);
    this.setSampleRate();
    this.modPlayer.connect(this.context.destination);
  }

  onMessage(event: MessageEvent) {
    this.ngZone.run(() => {
      console.log(event.data);
      switch (event.data.type) {
        case 'stop':
          this.state$.next({
            ...this.state$.getValue(),
            playing: false
          });
          console.log(this.state$.getValue());
          break;
      }
    });
  }

  setSampleRate() {
    this.modPlayer.port.postMessage({
      type: 'set_sample_rate',
      payload: this.context.sampleRate // 48000
    });
  }

  loadSong(modData: any) {
    console.log(this.modPlayer);
    this.state$.next({
      ...this.state$.getValue(),
      loaded: true
    });
    this.modPlayer.port.postMessage({
      type: 'load_song',
      payload: modData
    });
  }

  play() {
    const playing = this.state$.getValue().playing;
    if (playing) {
      this.modPlayer.port.postMessage({
        type: 'pause'
      });
    } else {
      this.modPlayer.port.postMessage({
        type: 'play'
      });
    }
    this.state$.next({
      ...this.state$.getValue(),
      playing: !playing
    });
  }

  stop() {
    this.modPlayer.port.postMessage({
      type: 'stop'
    });
    this.state$.next({
      ...this.state$.getValue(),
      playing: false
    });
  }

}
