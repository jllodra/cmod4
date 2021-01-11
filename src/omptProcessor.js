class OmptProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    // current sample-frame and time at the moment of instantiation
    // to see values change, you can put these two lines in process method
    // console.log(currentFrame)
    // console.log(currentTime)
  }

  process(inputs, outputs, params) {
    // this method gets automatically called with a buffer of 128 frames
    // audio process goes here
    // if you don't return true, webaudio will stop calling your process method
    return true;
  }

}

// the sample rate is not going to change ever,
// because it's a read-only property of a BaseAudioContext
// and is set only during its instantiation
// console.log(sampleRate);

// you can declare any variables and use them in you processors
// for example it may be an ArrayBuffer with a wavetable
// const usefulVariable = 42;
// console.log(usefulVariable);

registerProcessor('omptProcessor', ModuleProcessor as any);
