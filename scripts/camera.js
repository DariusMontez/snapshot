import _ from './elements.js'

/*
Steps to use camera

1. Get permission from user
2. Start streaming video from camera
3. When capture button is clicked, copy video frame to canvas
4. Create image from canvas data
*/

/*
(async function() {
    let stream;

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: "environment",
                frameRate: 10,
                width: 1920,
                height: 1080,
            }
        });

        console.log(stream);
    }

    catch {
        // user denied permission

    }

    console.log(stream);
})();
*/


// CAMERA STREAMING
// ================

function CameraPage() {
    const $videoStream = _("video", {autoplay: true, class: "video-stream"});
    const $captureButton = _("button", {class: "camera-click", "aria-label": "take photo"});

    const el = _("div", {class: "page camera-page"},
        $videoStream,
        $captureButton,
    );

    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
        console.error("This browser does not support camera devices");
    }

    // const $videoStream = document.getElementById("video-stream");

    window.onresize = e => {
        console.log(`Resizing video stream from ${$videoStream.width}x${$videoStream.height}
        to ${el.offsetWidth}x${el.offsetHeight}`);
        $videoStream.width = el.offsetWidth;
        $videoStream.height = el.offsetHeight;
    };


    const medaConstraints = {
        audio: false,
        video: {
            facingMode: "environment",
            width: 1920,
            height: 1080,
        }
    };

    navigator.mediaDevices.getUserMedia(medaConstraints)
        .then(stream => {
            $videoStream.srcObject = stream;
        })
        .catch(err => {
            console.warn(`User rejected permission to use camera. `);
            // display prompt to user:
            // "Please reload the app and give permission to use the camera."

            alert("Please reload the app and give permission to use the camera.");
        });

    // IMAGE CAPTURE
    // =============

    // const $captureCanvas = document.createElement("canvas");
    const $captureSound = document.createElement("audio");

    $captureSound.src = "/audio/42899__freqman__canon-dos-d30-no-focus.wav";

    $captureButton.onclick = capture;
    $videoStream.onclick = capture;

    function capture() {
        // play capture sound!
        $captureSound.play();

        const imageData = captureImageData($videoStream);
        const capturedImage = imageFromData(imageData);

        const captureEvent = new CustomEvent("capture", {
            bubbles: true,
        });
        captureEvent.data = {capturedImage};

        el.dispatchEvent(captureEvent);
    };

    el.$videoStream = $videoStream;

    return el;
}

function captureImageData($videoStream) {
    // draw video frame to canvas

    const $captureCanvas = document.createElement("canvas");
    window.onresize();
    $captureCanvas.width = $videoStream.videoWidth;
    $captureCanvas.height = $videoStream.videoHeight;

    console.log($captureCanvas.videoWidth, $videoStream.videoWidth);

    const ctx = $captureCanvas.getContext("2d");
    ctx.drawImage($videoStream, 0, 0, $videoStream.videoWidth, $videoStream.videoHeight);

    // get an ImageData object
    return ctx.getImageData(0, 0, $captureCanvas.width, $captureCanvas.height);
}

function imageFromData(imageData) {
    const canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(imageData, 0, 0);

    const image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
}

export {
    captureImageData,
    imageFromData,
    CameraPage
}