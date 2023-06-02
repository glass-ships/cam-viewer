var videoElement = document.querySelector("#videoElement");

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

if (navigator.mediaDevices.getUserMedia) {
    getStream();
};