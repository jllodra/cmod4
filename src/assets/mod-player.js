
import libopenmptModule from './libopenmpt.js';

const libopenmpt = libopenmptModule();

class ModPlayer extends AudioWorkletProcessor {

  maxFramesPerChunk = 128;

  ptrToFile;
  modulePtr;
  leftBufferPtr;
  rightBufferPtr;

  sampleRate = 48000; // default value

  shouldPlay = false;
  ended = false;

  counter = 0;

  constructor(options) {
    super();

    console.log(libopenmpt);

    this.port.onmessage = (event) => {
      console.log(event);
      switch (event.data.type) {
        case 'set_sample_rate':
          this.sampleRate = event.data.payload;
          break;
        case 'load_song':
          console.log(event.data.payload);
          const songData = event.data.payload;
          this.load(songData);
          break;
        case 'play':
          this.shouldPlay = true;
          break;
      }

    };
  }

  load(songData) {
    this.ptrToFile = libopenmpt._malloc(songData.byteLength);
    libopenmpt.HEAPU8.set(songData, this.ptrToFile);
    this.modulePtr = libopenmpt._openmpt_module_create_from_memory(this.ptrToFile, songData.byteLength, 0, 0, 0);
    this.leftBufferPtr  = libopenmpt._malloc(4 * this.maxFramesPerChunk);
    this.rightBufferPtr = libopenmpt._malloc(4 * this.maxFramesPerChunk);
    console.log(this.modulePtr);
  }

  process(inputs, outputs, parameters) {
    if (this.modulePtr == 0 || this.modulePtr == null) {
      return true;
    }

    if (!this.shouldPlay) {
      return true;
    }

    const output = outputs[0];

    const outputL = output[0];
    const outputR = output[1];

    let framesToRender = outputL.length;

    let framesRendered = 0;

    let ended = false;
    let error = false;

    while (framesToRender > 0) {
      let framesPerChunk = Math.min(framesToRender, this.maxFramesPerChunk);
      let actualFramesPerChunk = libopenmpt._openmpt_module_read_float_stereo(this.modulePtr, this.sampleRate, framesPerChunk, this.leftBufferPtr, this.rightBufferPtr);

      //console.log(actualFramesPerChunk);

      if (actualFramesPerChunk == 0) {
        ended = true;
        // modulePtr will be 0 on openmpt: error: openmpt_module_read_float_stereo: ERROR: module * not valid or other openmpt error
        error = !this.modulePtr;
      }

      const rawAudioLeft = libopenmpt.HEAPF32.subarray(this.leftBufferPtr / 4, this.leftBufferPtr / 4 + actualFramesPerChunk);
      const rawAudioRight = libopenmpt.HEAPF32.subarray(this.rightBufferPtr / 4, this.rightBufferPtr / 4 + actualFramesPerChunk);

      for (let i = 0; i < actualFramesPerChunk; ++i) {
        outputL[framesRendered + i] = rawAudioLeft[i];
        outputR[framesRendered + i] = rawAudioRight[i];
      }
      for (let i = actualFramesPerChunk; i < framesPerChunk; ++i) {
        outputL[framesRendered + i] = 0;
        outputR[framesRendered + i] = 0;
      }
      framesToRender -= framesPerChunk;
      framesRendered += framesPerChunk;
    }


    if (ended) {
      // this.disconnect();
      // this.cleanup();
      // error ? processNode.player.fireEvent('onError', {type: 'openmpt'}) : processNode.player.fireEvent('onEnded');
    }

    return true;
  }

  cleanup = function() {
    if (this.modulePtr != 0) {
      libopenmpt._openmpt_module_destroy(this.modulePtr);
      this.modulePtr = 0;
    }
    if (this.leftBufferPtr != 0) {
      libopenmpt._free(this.leftBufferPtr);
      this.leftBufferPtr = 0;
    }
    if (this.rightBufferPtr != 0) {
      libopenmpt._free(this.rightBufferPtr);
      this.rightBufferPtr = 0;
    }
  }

}

registerProcessor('mod-player', ModPlayer);
