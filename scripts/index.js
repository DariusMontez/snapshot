// Data Model

import _ from './elements.js'
// import data from '/scripts/mock-data.js'
import {
    CameraPage,
    captureImageData,
    scaleImageData,
    imageFromData,
    imageToData
} from './camera.js'

const Player = {
    create({name, photoURL, snaps=[]}) {
        return {
            name,
            photoURL,
            snaps, // [Player]
        };
    },

    add(player) {
        data.teams.push(player);
        commitData();
    },

    addSnap(player, other) {
        player.snaps.push(other.name);
        commitData();
    },

    remove(player) {
        const index = data.teams.indexOf(player);
        data.teams.splice(index, 1);
        commitData();
    },

    removeSnap(player, other) {
        const index = player.snaps.indexOf(other.name);
        player.snaps.splice(index, 1);
        commitData();
    }
};

function commitData() {
    localStorage.setItem("data", JSON.stringify(data));
}

function getData(initial={}) {
    return JSON.parse(localStorage.getItem("data")) || initial;
}

const initialData = {
    me: {name: "Drew + Cassie", photoURL: "https://lorempixel.com/48/48", snaps: []},
    teams: [

    ],
};

let data = getData(initialData);

// MAIN PAGE
function MainPage() {
    const $camera = new CameraPage();

    const el = _("div", {class: "page main-page"},
        $camera,
        _("div", {id: "drawer-handle"},
            _("i", {class: "material-icons"}, "playlist_add_check"),
        ),
    );

    el.$camera = $camera;

    return el;
}

const $mainPage = new MainPage();
document.body.appendChild($mainPage);

// SIDE DRAWER
// ===========

const $drawer = document.getElementById("drawer");

const $drawerHandle = document.getElementById("drawer-handle");
$drawerHandle.onclick = function() {
    $drawer.open = true;
}

$drawer.querySelector(".btn-add-player").onclick = () => {
    $drawer.open = false;

    const page = new AddPlayerPage();
    document.body.appendChild(page);
};

$drawer.querySelector(".btn-remove-players").onclick = () => {
    const snapped = (player) => data.me.snaps.includes(player.name);
    data.teams.filter(snapped).map(player => {
        Player.removeSnap(data.me, player);
        Player.remove(player);
    })

    $hitlist.update();
};

const $progress = document.getElementById("progress");

// Header
// ------

const $header = document.getElementById("header");
// $header.textContent = data.me.name;


// Hit List
// --------



function HitlistRow({team}) {
    const el = _("li", {},
        team.name,
        _("img", {src: team.photoURL, class: "circle"}),
    );

    el.team = team;

    Object.defineProperty(el, "snapped", {
        get() {
            return data.me.snaps.includes(team.name);
        },
        set(value) {
            if (value) {
                Player.addSnap(data.me, team);
            } else {
                Player.removeSnap(data.me, team);
            }

            el.update();
        }
    });

    el.update = function() {
        if (el.snapped) {
            el.classList.add("snapped");
            el.icon = _("i", {class: "material-icons check-overlay"}, "check_circle");
            el.appendChild(el.icon);
        } else {
            el.classList.remove("snapped");

            if (!!el.icon) {
                el.icon.remove();
            }
        }
    }

    el.update();

    return el;
}

function Hitlist({el=_("ul")}) {
    // const el = _("ul");

    el.update = function() {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }

        for (let team of data.teams) {
            const row = new HitlistRow({team});
            row.onclick = e => {
                row.snapped = !row.snapped;
                // console.log(`Row click: ${row.team.name}. snapped=${row.snapped}`);
                $progress.textContent = `${data.me.snaps.length} / ${data.teams.length}`;
            };
            el.appendChild(row);
        }

        $progress.textContent = `${data.me.snaps.length} / ${data.teams.length}`;
    }

    el.update();

    return el;
}

const $hitlist = new Hitlist({el: document.getElementById("hitlist")});


// Add Player
// ----------

function AddPlayerPage() {
    const el = _("div", {class: "page add-player-page"},
        // _("p", {style: "margin: 8px"}, "Player's name"),
        _("input", {name: "name", placeholder: "Player's name", style: "margin: 8px"}),
        _("button", {name: "add-photo"}, "Take photo"),

        _("img", {name: "photo-preview"}),

        _("button", {name: "submit"}, "Add Player!"),
        _("button", {name: "cancel"}, "Cancel"),
    );

    const $name = el.querySelector("input[name=name]");
    const $addPhotoBtn = el.querySelector("button[name=add-photo]");
    const $submitBtn = el.querySelector("button[name=submit]");
    const $cancelButton = el.querySelector("button[name=cancel]");
    const $photoPreview = el.querySelector("img[name=photo-preview]");

    const newPlayer = {
        name: null,
        photoURL: "https://lorempixel.com/48/48",
        snaps: [],
    };

    $cancelButton.onclick = () => {
        el.remove();
    };

    $addPhotoBtn.onclick = () => {
        const cameraPage = new CameraPage();
        document.body.appendChild(cameraPage);
        window.onresize(); // let cameraPage take up the screen

        cameraPage.addEventListener("capture", e => {
            const image = e.data.capturedImage;
            console.log(`captured and image! ${e.data.imageData.width}x${e.data.imageData.height}`);

            // make an 48px version of the original size
            // (to save precious localStorage space)
            let min = Math.min(e.data.imageData.width, e.data.imageData.height);
            console.log(min);
            let scale = 48 / min;
            let d = scaleImageData(e.data.imageData, scale);
            let smallImg = imageFromData(d);

            $photoPreview.src = image.src;
            newPlayer.photoURL = smallImg.src;

            cameraPage.remove();
        });
    }

    $submitBtn.onclick = addPlayer;

    function addPlayer() {
        newPlayer.name = $name.value;

        console.log("New player added:", newPlayer);

        Player.add(newPlayer);
        $hitlist.update();

        el.remove();
    }

    return el;
}


// CAMERA
// ======

$mainPage.addEventListener("capture", downloadCapturedImage);

function downloadCapturedImage(e) {
    console.log("image captured!");
    // console.log(e.data);

    // create a hyperlink to the image's src

    const a = document.createElement("a");
    a.href = e.data.capturedImage.src;
    a.download = `${new Date()}.png`;
    console.log(a);
    document.body.append(a);
    a.click();
    a.remove();
}

Object.assign(window, {
    $hitlist,
    data,
    commitData,
    Player,
});

function pollQR() {
    const $captureButton = $mainPage.$camera.querySelector(".camera-click");

    // let bg = getComputedStyle($captureButton).backgroundColor;


    const imageData = captureImageData($mainPage.$camera.$videoStream);


    const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
    });

    if (code !== null) {
        console.log(`QR code: ${code.data}`)

        $captureButton.style.backgroundColor = "green";

        // window.location = code.data;
        alert(code.data);
    } else {
        $captureButton.style.backgroundColor = null;
    }

    setTimeout(pollQR, 200);
    // requestAnimationFrame(pollQR);
}

// QR-CODE READ LOOP
// =================

// setTimeout(pollQR, 3000);
