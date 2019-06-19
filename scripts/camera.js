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

function updateVideoSize() {

}

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

    el.updateVideoSize = function() {
        console.log(`Resizing video stream from ${$videoStream.width}x${$videoStream.height}
        to ${el.offsetWidth}x${el.offsetHeight}`);
        $videoStream.width = el.offsetWidth;
        $videoStream.height = el.offsetHeight;
    };

    window.addEventListener("resize", function() {
        el.updateVideoSize();
    });


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

    $captureSound.src = "audio/42899__freqman__canon-dos-d30-no-focus.wav";

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
        captureEvent.data = {capturedImage, imageData};

        el.dispatchEvent(captureEvent);
    };

    el.$videoStream = $videoStream;

    return el;
}

function captureImageData($videoStream) {
    // draw video frame to canvas

    const $captureCanvas = document.createElement("canvas");
    $captureCanvas.width = $videoStream.videoWidth;
    $captureCanvas.height = $videoStream.videoHeight;

    console.log($captureCanvas.width, $videoStream.videoWidth);

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

function imageToData(image) {
    const c = document.createElement("canvas");
    c.width = image.width;
    c.height = image.height;

    console.log(image.width, image.height);


    ctx.drawImage(image, 0, 0, image.width, image.height);

    // get an ImageData object
    return ctx.getImageData(0, 0, c.width, c.height);
}

function scaleImageData(imageData, scale) {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");

    c.width = imageData.width;
    c.height = imageData.height;

    let newWidth = ~~(imageData.width * scale);
    let newHeight = ~~(imageData.height * scale)
    console.log(`scaleImageData: scaling image to ${newWidth}x${newHeight}`);

    // ctx.scale(2, 2);
    ctx.putImageData(imageData, 0, 0)
    ctx.drawImage(c, 0, 0, newWidth, newHeight);
    // ctx.scale(0.1, 0.1);
    return ctx.getImageData(0, 0, newWidth, newHeight);
}



// edited from https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob#Polyfill
function downloadDataURI(dataURI) {
    var binStr = atob(dataURI.split(',')[1]),
      len = binStr.length,
      arr = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }

    var callback = function(blob) {
        var a = document.createElement('a');
        a.download = `${new Date()}.png`;
        a.innerHTML = `download`;
        // the string representation of the object URL will be small enough to workaround the browser's limitations
        a.href = URL.createObjectURL(blob);
        // you must revoke the object URL,
        //   but since we can't know when the download occured, we have to attach it on the click handler..

        // console.log(a);

        // a.onclick = function() {
        //     // ..and to wait a frame
        //     requestAnimationFrame(function() {
        //         console.log("link clicked")
        //         URL.revokeObjectURL(a.href);
        //     });
        //     a.removeAttribute('href');
        // };

        document.body.appendChild(a);
        a.click();

        a.remove();
    };

    callback(new Blob([arr]));
  }



//   dataURIToBlob(yourDataURL, callback);

export {
    captureImageData,
    imageFromData,
    imageToData,
    scaleImageData,
    downloadDataURI,
    CameraPage
}