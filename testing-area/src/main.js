const context = new AudioContext({
  latencyHint: 'playback'
});

var loadedMod;

var modPlayer;

const runner = (async (context) => {

  await context.audioWorklet.addModule('mod-player.js');
  modPlayer = new AudioWorkletNode(context, 'mod-player', {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [2]
  });
  modPlayer.port.onmessage = (event) => {
    console.log(event.data); // Data FROM the processor
  };
  modPlayer.port.postMessage({
    type: 'set_sample_rate',
    payload: context.sampleRate // 48000
  });
  modPlayer.port.postMessage({
    type: 'load_song',
    payload: loadedMod
  });
  modPlayer.connect(context.destination);
});


var xhr = new XMLHttpRequest();
xhr.responseType = 'arraybuffer'; // make response as ArrayBuffer
xhr.open('GET',
'radix_-_yuki_satellites.xm'
  , true);

xhr.send();
xhr.onload = (event) => {
  console.log(xhr.response);
  loadedMod = new Int8Array(xhr.response);
  console.log(loadedMod);

  runner(context)
    .then(console.log)
    .catch(console.error);

  document.getElementById('play').addEventListener('click', () => {
    modPlayer.port.postMessage({
      type: 'play'
    });
  });

}


