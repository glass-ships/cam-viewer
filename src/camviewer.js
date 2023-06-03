var videoElement = document.querySelector("#videoElement");

/** Capture webcam and microphone and stream to video element */
const getStream = () => {
    navigator.mediaDevices.getUserMedia({ 
        audio: { 
            noiseSuppression: false,
            echoCancellation: false,
            autoGainControl: false,
            channelCount: 2,
            latency: 0.0,
        },
        video: {
            width: 1920, 
            height: 1080
        },
    })
    .then(function (stream) {
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = (e) => {
            videoElement.play();
      };
    })
    .catch(function (err) {
        console.log("Something went wrong!" + err);
    });
};

/** Check if browser supports getUserMedia */
if (navigator.mediaDevices.getUserMedia) {
    getStream();
} else {
    console.log("getUserMedia not supported");
};

/** If tab is inactive, pop out video player */
document.addEventListener("visibilitychange", (event) => {
    if (document.visibilityState == "visible") {
        videoElement.exitPictureInPicture();
    } else {
        videoElement.requestPictureInPicture();
    };
  });