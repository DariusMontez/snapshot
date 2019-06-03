import _ from '/scripts/elements.js'

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
    const $videoStream = _("video", {autoplay: true, id: "video-stream"});
    const $captureButton = _("button", {id: "camera-click", "aria-label": "take photo"});

    const el = _("div", {class: "page", id: "camera-page"},
        $videoStream,
        $captureButton,
    );

    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
        console.error("This browser does not support camera devices");
    }

    // const $videoStream = document.getElementById("video-stream");

    window.onresize = e => {
        $videoStream.width = document.body.offsetWidth;
        $videoStream.height = document.body.offsetHeight;
    };
    window.onresize();

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

    const $captureCanvas = document.createElement("canvas");
    const $captureSound = document.createElement("audio");

    $captureSound.src = "/audio/42899__freqman__canon-dos-d30-no-focus.wav";

    // const $captureButton = document.getElementById("camera-click");
    $captureButton.onclick = e => {

        // play capture sound!
        $captureSound.play();

        // draw video frame to canvas

        $captureCanvas.width = $videoStream.width;
        $captureCanvas.height = $videoStream.height;

        const ctx = $captureCanvas.getContext("2d");
        ctx.drawImage($videoStream, 0, 0);

        // create image from canvas data
        // use webp format. Older browsers will fall back to png.
        const capturedImage = new Image();
        capturedImage.src = $captureCanvas.toDataURL("image/webp");

        // broadcast custom "capture" event with image

        const captureEvent = new Event("capture");
        captureEvent.data = {capturedImage};

        $captureButton.dispatchEvent(captureEvent);


    }

    return el;
}

export {
    CameraPage
}