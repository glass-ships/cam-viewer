// 'use strict';
// webView.getSettings().setMediaPlaybackRequiresUserGesture(false);


var videoElement = document.querySelector("#videoElement");
var audioSelect = document.querySelector('select#audioSource');
var videoSelect = document.querySelector('select#videoSource');

audioSelect.onchange = getStream;
videoSelect.onchange = getStream;

/** Check if browser supports getUserMedia */
if (navigator.mediaDevices.getUserMedia) {
    getStream().then(getDevices).then(gotDevices);
} else {
  console.log("getUserMedia not supported");
};

/** Get list of available devices */
function getDevices() {
  const devices = navigator.mediaDevices.enumerateDevices();
  console.log("devices", devices);
  return devices;
//   return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
  window.deviceInfos = deviceInfos; // make available to console
  console.log('Available input and output devices:', deviceInfos);
  for (const deviceInfo of deviceInfos) {
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
      audioSelect.appendChild(option);
    } else if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    }
  }
}


/** Capture webcam and microphone and stream to video element */
function getStream() {
  const audioSource = audioSelect.value;
  const videoSource = videoSelect.value;
  const constraints = {
    audio: {
      deviceId: audioSource ? {exact: audioSource} : undefined,
      noiseSuppression: false,
      echoCancellation: false,
      autoGainControl: false,
      channelCount: 2,
      latency: 0.0,
    },
    video: {
      deviceId: videoSource ? {exact: videoSource} : undefined,
      width: 1920,
      height: 1080,
    }
  };
  console.log(constraints);
  return navigator.mediaDevices.getUserMedia(constraints)
    .then(gotStream)
    .catch(function (err) {
      console.log("Something went wrong!" + err);
    });
};

function playStream(stream) {
  videoElement.srcObject = stream;
  videoElement.onloadedmetadata = (e) => {
    videoElement.play();
  };
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  audioSelect.selectedIndex = [...audioSelect.options].
    findIndex(option => option.text === stream.getAudioTracks()[0].label);
  videoSelect.selectedIndex = [...videoSelect.options].
    findIndex(option => option.text === stream.getVideoTracks()[0].label);
  videoElement.srcObject = stream;
  videoElement.onloadedmetadata = (e) => {
    videoElement.play();
  };
}


function handleError(error) {
console.error('Error: ', error);
}

/** If tab is inactive, pop out video player */
document.addEventListener("visibilitychange", (event) => {
    if (document.visibilityState == "visible") {
        document.exitPictureInPicture();
    } else {
        videoElement.requestPictureInPicture();
    };
  });