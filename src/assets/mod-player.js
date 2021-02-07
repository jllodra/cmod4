
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
          this.load(
            event.data.payload.requestId,
            event.data.payload.requestId,
            event.data.payload.modData);
          break;
        case 'read_metadata': // Just reads metadata from file
          this.readMetadata(
            event.data.payload.requestId,
            event.data.payload.requestId,
            event.data.payload.modData);
          break;
        case 'play':
          this.play();
          break;
        case 'pause':
          this.pause();
          break;
        case 'stop':
          this.stop();
          break;
      }
    };
  }

  load(requestId, filePath, songData) {
    this.cleanup();
    this.ptrToFile = libopenmpt._malloc(songData.byteLength);
    libopenmpt.HEAPU8.set(songData, this.ptrToFile);
    this.modulePtr = libopenmpt._openmpt_module_create_from_memory(this.ptrToFile, songData.byteLength, 0, 0, 0);
    this.leftBufferPtr  = libopenmpt._malloc(4 * this.maxFramesPerChunk);
    this.rightBufferPtr = libopenmpt._malloc(4 * this.maxFramesPerChunk);

    const metadata = this.readMetadata(requestId, filePath);

    // Return song_loaded

    this.port.postMessage({
      type: 'song_loaded',
      payload: metadata
    });

  }

  readMetadata(requestId, filePath, songData) { // TODO: Will be used when we load a song (drag and drop) but we don't want to play it in that moment
    let modulePtr;
    if (songData) { // read metadata from data given
      let ptrToFile = libopenmpt._malloc(songData.byteLength); // todo: check if we need to free ptrToFile
      libopenmpt.HEAPU8.set(songData, ptrToFile);
      modulePtr = libopenmpt._openmpt_module_create_from_memory(this.ptrToFile, songData.byteLength, 0, 0, 0);
    } else {
      modulePtr = this.modulePtr;
    }

    // Metadata:
    const metadata = {};
    const metadata_keys = libopenmpt.UTF8ToString(libopenmpt._openmpt_module_get_metadata_keys(modulePtr));
    const keys = metadata_keys.split(';');
    let keyNameBuffer = 0;
    for (let i = 0; i < keys.length; i++) {
      keyNameBuffer = libopenmpt._malloc(keys[i].length + 1);
      libopenmpt.writeAsciiToMemory(keys[i], keyNameBuffer);
      metadata[keys[i]] = libopenmpt.UTF8ToString(libopenmpt._openmpt_module_get_metadata(modulePtr, keyNameBuffer));
      libopenmpt._free(keyNameBuffer);
    }
    metadata.duration = libopenmpt._openmpt_module_get_duration_seconds(modulePtr);
    metadata.duration_str = `${metadata.duration / 60 | 0}:${Math.floor(metadata.duration % 60)}`;
    metadata.requestId = requestId;
    metadata.filePath = filePath;
    libopenmpt._openmpt_free_string(metadata_keys);

    console.log(modulePtr);

    if (songData) {
      libopenmpt._openmpt_module_destroy(modulePtr);
      // _free ptrToFile?
      this.port.postMessage({
        type: 'metadata_read',
        payload: metadata
      });
    }

    return metadata;
  }

  play() {
    this.shouldPlay = true;
  }

  pause() {
    this.shouldPlay = false;
  }

  stop() {
    this.shouldPlay = false;
    libopenmpt._openmpt_module_set_position_seconds(this.modulePtr, 0);
  }

  cleanup() {
    if (this.modulePtr && this.modulePtr != 0) {
      libopenmpt._openmpt_module_destroy(this.modulePtr);
      this.modulePtr = 0;
    }
    if (this.leftBufferPtr && this.leftBufferPtr != 0) {
      libopenmpt._free(this.leftBufferPtr);
      this.leftBufferPtr = 0;
    }
    if (this.rightBufferPtr && this.rightBufferPtr != 0) {
      libopenmpt._free(this.rightBufferPtr);
      this.rightBufferPtr = 0;
    }
    // _free ptrToFile?
  }

  process(inputs, outputs, parameters) {
    if (this.modulePtr === 0 || this.modulePtr == null ||
      this.leftBufferPtr === 0 || this.leftBufferPtr == null ||
      this.rightBufferPtr === 0 ||this.rightBufferPtr == null
      ) {
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
      if (actualFramesPerChunk === 0) {
        console.log('Song ended');
        this.stop();
        this.port.postMessage({
          type: 'stop'
        });
      }
    }

    return true;
  }

}

registerProcessor('mod-player', ModPlayer);
