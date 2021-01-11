import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private readonly context: AudioContext;
  private modPlayer: AudioWorkletNode;

  public $ready: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    this.context = new AudioContext({
      latencyHint: 'playback'
    });
    this.context.audioWorklet.addModule('/assets/mod-player.js')
      .then(() => {
        console.log('setup');
        this.setupModPlayer();
        this.$ready.next(true);
      });
  }

  setupModPlayer() {
    this.modPlayer = new AudioWorkletNode(this.context, 'mod-player', {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2]
    });
    this.modPlayer.port.onmessage = this.onMessage;
    this.setSampleRate();
    this.modPlayer.connect(this.context.destination);
  }

  onMessage(event: MessageEvent) {
    console.log(event.data);
  }

  setSampleRate() {
    this.modPlayer.port.postMessage({
      type: 'set_sample_rate',
      payload: this.context.sampleRate // 48000
    });
  }

  loadSong(modData: any) {
    console.log(this.modPlayer);
    this.modPlayer.port.postMessage({
      type: 'load_song',
      payload: modData
    });
  }

  play() {
    this.modPlayer.port.postMessage({
      type: 'play'
    });
  }

}
