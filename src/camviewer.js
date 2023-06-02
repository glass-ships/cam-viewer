var video = document.querySelector("#videoElement");

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
        video.srcObject = stream;
        video.onloadedmetadata = (e) => {
            video.play();
      };
    })
    .catch(function (err) {
        console.log("Something went wrong!" + err);
    });
};

if (navigator.mediaDevices.getUserMedia) {
    getStream();
};
