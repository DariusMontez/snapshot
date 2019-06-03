// Data Model

import _ from '/scripts/elements.js'
// import data from '/scripts/mock-data.js'
import {CameraPage} from '/scripts/camera.js'

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
    const el = _("div", {class: "page", id: "main-page"},
        new CameraPage(),
        _("div", {id: "drawer-handle"},
            _("i", {class: "material-icons"}, "playlist_add_check"),
        ),
    );

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

const $progress = document.getElementById("progress");

// Header
// ------

const $header = document.getElementById("header");
$header.textContent = data.me.name;


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


Object.assign(window, {
    $hitlist,
    data,
})

// Add Player
// ----------

function AddPlayerPage() {
    const el = _("div", {class: "page", id: "add-player-page"},
        "Player's name",
        _("input", {name: "name"}),
        _("button", {}, "Add Player!")
    );

    const $name = el.querySelector("input[name=name]");
    const $btn = el.querySelector("button");
    $btn.onclick = addPlayer;

    function addPlayer() {
        const newPlayer = {
            name: $name.value,
            photoURL: "https://lorempixel.com/48/48",
            snaps: [],
        };

        console.log("New player added:", newPlayer);

        Player.add(newPlayer);
        $hitlist.update();

        el.remove();
    }

    return el;
}

document.getElementById("btn-add-player").onclick = () => {
    $drawer.open = false;

    const page = new AddPlayerPage();
    document.body.appendChild(page);
};



// CAMERA
// ======

const $captureButton = document.getElementById("camera-click");
$captureButton.addEventListener("capture", downloadCapturedImage);

function downloadCapturedImage(e) {
    console.log("image captured!");
    console.log(e.data);

    // create a hyperlink to the image's src

    const a = document.createElement("a");
    a.href = e.data.capturedImage.src;
    a.download = `${new Date()}.png`;
    console.log(a);
    document.body.append(a);
    a.click();
    a.remove();
}