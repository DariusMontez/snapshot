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

    const $captureCanvas = document.createElement("canvas");
    const $captureSound = document.createElement("audio");

    $captureSound.src = "/audio/42899__freqman__canon-dos-d30-no-focus.wav";

    // const $captureButton = document.getElementById("camera-click");
    $captureButton.onclick = e => {

        // play capture sound!
        $captureSound.play();

        // draw video frame to canvas
        window.onresize();
        console.log(`Resizing capture canvas from ${$captureCanvas.width}x${$captureCanvas.height}
        to ${$videoStream.width}x${$videoStream.height}`);
        $captureCanvas.width = $videoStream.width;
        $captureCanvas.height = $videoStream.height;

        const ctx = $captureCanvas.getContext("2d");
        ctx.drawImage($videoStream, 0, 0);

        // create image from canvas data
        // use webp format. Older browsers will fall back to png.
        const capturedImage = new Image();
        capturedImage.src = $captureCanvas.toDataURL("image/webp");

        // not necessary. This is just for the event handler in case it is curious
        capturedImage.width = $captureCanvas.width;
        capturedImage.height = $captureCanvas.height;

        // broadcast custom "capture" event with image

        const captureEvent = new CustomEvent("capture", {
            bubbles: true,
        });
        captureEvent.data = {capturedImage};

        el.dispatchEvent(captureEvent);


    }

    return el;
}

export {
    CameraPage
}