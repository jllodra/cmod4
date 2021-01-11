import { Component, NgZone, OnInit } from '@angular/core';
import { register } from 'ts-node';

/*
 * @todo This is currently only a copy all the types needed to define the MessagePort. The type definitions are copied from TypeScripts
 * webworker library. In addition to that this file also contains the definitions of the globally available AudioWorkletProcessor class and
 * the registerProcessor function.
 */
/*
interface Event { // tslint:disable-line:interface-name

  readonly AT_TARGET: number;

  readonly bubbles: boolean;

  readonly BUBBLING_PHASE: number;

  readonly cancelable: boolean;

  cancelBubble: boolean;

  readonly CAPTURING_PHASE: number;

  readonly currentTarget: EventTarget | null;

  readonly defaultPrevented: boolean;

  readonly eventPhase: number;

  readonly isTrusted: boolean;

  readonly NONE: number;

  returnValue: boolean;

  readonly scoped: boolean;

  readonly srcElement: object | null;

  readonly target: EventTarget | null;

  readonly timeStamp: number;

  readonly type: string;

  deepPath (): EventTarget[];

  initEvent (type: string, bubbles?: boolean, cancelable?: boolean): void;

  preventDefault (): void;

  stopImmediatePropagation (): void;

  stopPropagation (): void;

}

type EventListener = (evt: Event) => void;

interface EventListenerObject { // tslint:disable-line:interface-name

  handleEvent (evt: Event): void;

}

interface EventListenerOptions { // tslint:disable-line:interface-name

  capture?: boolean;

}

interface AddEventListenerOptions extends EventListenerOptions { // tslint:disable-line:interface-name

  once?: boolean;

  passive?: boolean;

}

type EventListenerOrEventListenerObject = EventListener | EventListenerObject;

interface EventTarget { // tslint:disable-line:interface-name

  addEventListener (type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void;

  dispatchEvent (evt: Event): boolean;

  removeEventListener (
    type: string,
    listener?: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean
  ): void;

}

interface MessageEvent extends Event { // tslint:disable-line:interface-name

  readonly data: any;

  readonly origin: string;

  readonly ports: ReadonlyArray<MessagePort>;

  readonly source: object | null;

  initMessageEvent (
    type: string,
    bubbles: boolean,
    cancelable: boolean,
    data: any,
    origin: string,
    lastEventId: string,
    source: object
  ): void;

}

interface MessagePortEventMap { // tslint:disable-line:interface-name

  message: MessageEvent;

}

interface MessagePort extends EventTarget { // tslint:disable-line:interface-name

  onmessage: ((this: MessagePort, ev: MessageEvent) => any) | null;

  addEventListener <K extends keyof MessagePortEventMap> (
    type: K,
    listener: (this: MessagePort, ev: MessagePortEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  close (): void;

  postMessage (message?: any, transfer?: any[]): void;

  removeEventListener <K extends keyof MessagePortEventMap> (
    type: K,
    listener: (this: MessagePort, ev: MessagePortEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;

  start (): void;

}

declare var MessagePort: {

  prototype: MessagePort;

  new (): MessagePort;

};

interface AudioWorkletProcessor { // tslint:disable-line:interface-name

  port: MessagePort;

}

interface AudioParamDescriptor { // tslint:disable-line:interface-name

  defaultValue?: number;

  maxValue?: number;

  minValue?: number;

  name: string;

}

interface AudioNodeOptions { // tslint:disable-line:interface-name

  channelCount: number;

  channelCountMode: 'clamped-max' | 'explicit' | 'max';

  channelInterpretation: 'discrete' | 'speakers';

}

interface AudioWorkletNodeOptions extends AudioNodeOptions { // tslint:disable-line:interface-name

  numberOfInputs?: number;

  numberOfOutputs?: number;

  outputChannelCount: number[];

  parameterData: { [ name: string ]: number };

  processorOptions?: any;

}

interface AudioWorkletProcessorConstructor { // tslint:disable-line:interface-name

  parameterDescriptors: AudioParamDescriptor[];

  new (options: AudioWorkletNodeOptions): AudioWorkletProcessor;

}

declare var AudioWorkletProcessor: {

  prototype: AudioWorkletProcessor;

  new (): AudioWorkletProcessor;

};

declare const currentFrame: number;

declare const currentTime: number;

declare const sampleRate: number;

declare function registerProcessor <T extends AudioWorkletProcessorConstructor> (name: string, processorCtor: T): void;



*/







@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'cmod4';
  // title = String(window.nw.require('fs').readFileSync('./package.json'));

  byteArray = null;
  filePtr = null;
  memPtr = null;
  leftBufferPtr = null;
  rightBufferPtr = null;
  maxFramesPerChunk = 4096;
  status = {
    stopped: true,
    paused: false,
    playingNectarine: false,
    bufferIsEmptyEnsured: false,
    volume: 100
  };

  constructor(public ngZone: NgZone) {
  }

  ngOnInit() {
    // this.openMpt();

    this.openMpt2();

    /*
    let buffer;
    var xhr = new window.XMLHttpRequest();
    xhr.open('GET', 'G:\\modules\\modarchive\\radix\\radix_[68796]_colours.xm', true);
    xhr.responseType = 'arraybuffer';
    //status.loading = true;
    xhr.onload = function (evt) {
      // TODO: check possible errors
      if(xhr.response) {
        buffer = xhr.response;
        console.log(buffer);
        this.loadBuffer(buffer);
        this.play();
      }
    }.bind(this);
    xhr.send(null);
    */


  }

  openMpt2() {
    this.ngZone.runOutsideAngular(() => {
      var audioContext = new window.AudioContext();
      // audioContext.audioWorklet.addModule('H:\\Code\\cmod4\\src\\app\\omptProcessor.js').then(
      audioContext.audioWorklet.addModule('omptProcessor.js').then(
        (e) => {
          console.log(e);
          const testNode = new AudioWorkletNode(audioContext, 'omptProcessor')
          testNode.connect(audioContext.destination);
        }
      )
    });

  }

  openMpt() {
    var audioContext = new window.AudioContext();


    var processNode = audioContext.createScriptProcessor(this.maxFramesPerChunk/*4096*//*8192*//*16384*/, 0, 2);
    //var mp3stream = audioContext.createMediaElementSource(window.document.querySelector('audio'));
    var gainNode = audioContext.createGain();
    var safeGainNode = audioContext.createGain(); // we'll hopefully fix this with a worker that supports a ScriptProcessor
    var splitter = audioContext.createChannelSplitter();
    var analyserNodeCh1 = audioContext.createAnalyser();
    analyserNodeCh1.smoothingTimeConstant = 0.8;
    analyserNodeCh1.fftSize = 32;
    var analyserNodeCh2 = audioContext.createAnalyser();
    analyserNodeCh2.smoothingTimeConstant = 0.8;
    analyserNodeCh2.fftSize = 32;
    processNode.connect(gainNode);
    //mp3stream.connect(gainNode);
    gainNode.connect(safeGainNode);
    safeGainNode.connect(audioContext.destination);
    safeGainNode.connect(splitter);
    splitter.connect(analyserNodeCh1, 0, 0);
    splitter.connect(analyserNodeCh2, 1, 0);

    var isConnected = false; // TODO: not used

    processNode.onaudioprocess = function(e) {
      var outputL = e.outputBuffer.getChannelData(0);
      var outputR = e.outputBuffer.getChannelData(1);
      var framesToRender = outputL.length;
      //
      var i;
      if (this.status.stopped || this.status.paused || this.status.playingNectarine) { // stop
        for (i = 0; i < framesToRender; ++i) {
          outputL[i] = 0;
          outputR[i] = 0;
        }
        if (!this.status.bufferIsEmptyEnsured) {
          safeGainNode.gain.value = 0; // no data (disconnecting through the safe gain node)
          this.status.bufferIsEmptyEnsured = true;
        } else {
          safeGainNode.gain.value = 1;
        }
        return;
      }
      this.status.bufferIsEmptyEnsured = false;
      var framesRendered = 0;
      while (framesToRender > 0) {
        var framesPerChunk = Math.min(framesToRender, this.maxFramesPerChunk);
        var actualFramesPerChunk = window.ompt._openmpt_module_read_float_stereo(
          this.memPtr,
          audioContext.sampleRate,
          framesPerChunk,
          this.leftBufferPtr,
          this.rightBufferPtr);
        var rawAudioLeft = window.ompt.HEAPF32.subarray(this.leftBufferPtr / 4, this.leftBufferPtr / 4 + actualFramesPerChunk);
        var rawAudioRight = window.ompt.HEAPF32.subarray(this.rightBufferPtr / 4, this.rightBufferPtr / 4 + actualFramesPerChunk);
        for (i = 0; i < actualFramesPerChunk; ++i) {
          outputL[framesRendered + i] = rawAudioLeft[i];
          outputR[framesRendered + i] = rawAudioRight[i];
        }
        for (i = actualFramesPerChunk; i < framesPerChunk; ++i) {
          outputL[framesRendered + i] = 0;
          outputR[framesRendered + i] = 0;
        }
        framesToRender -= framesPerChunk;
        framesRendered += framesPerChunk;
        if (actualFramesPerChunk === 0) {
          // end();
        } else {
          safeGainNode.gain.value = 1; // we have data (reconnecting through the safe gain node)
        }
      }
    }.bind(this);

  }

  loadBuffer(buffer) {
    console.info("loadBuffer");
    /*worker.postMessage({
      command: "loadBuffer",
      data: buffer
    });*/
    this.byteArray = new Int8Array(buffer);
    this.filePtr = window.ompt._malloc(this.byteArray.byteLength);
    window.ompt.HEAPU8.set(this.byteArray, this.filePtr);
    this.memPtr = window.ompt._openmpt_module_create_from_memory(this.filePtr, this.byteArray.byteLength, 0, 0, 0);
    console.log(this.memPtr);
    this.leftBufferPtr = window.ompt._malloc(4 * this.maxFramesPerChunk);
    this.rightBufferPtr = window.ompt._malloc(4 * this.maxFramesPerChunk);
  }

  play() {
    console.log('should play');
    this.status.stopped = false;
  }

}
