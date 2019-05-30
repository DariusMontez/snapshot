// Data Model

import _ from '/scripts/elements.js'
import data from '/scripts/mock-data.js'

const Team = {
    create({name, photoURL, snaps=[]}) {
        return {
            name,
            photoURL,
            snaps, // [Team]
        };
    }
};

// populate UI with data

const me = data.teams[0];
me.snaps = [];

const $hitlist = document.getElementById("hitlist");

function HitlistRow({team}) {
    const el = _("li", {},
        team.name,
        _("img", {src: team.photoURL, class: "circle"}),
    );

    el.team = team;

    Object.defineProperty(el, "snapped", {
        get() {
            return me.snaps.includes(team.name);
        },
        set(value) {
            if (value) {
                me.snaps.push(team.name);
            } else {
                delete me.snaps[me.snaps.indexOf(team.name)];
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

function Hitlist() {
    const el = _("ul");

    el.update = function() {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }

        const otherTeams = data.teams.filter(t => t.name != me.name);

        for (let team of otherTeams) {
            const row = new HitlistRow({team});
            row.onclick = e => {
                row.snapped = !row.snapped;
                // console.log(`Row click: ${row.team.name}. snapped=${row.snapped}`);

            };
            el.appendChild(row);
        }

        $progress.textContent = `${me.snaps.length} / ${otherTeams.length}`;
    }

    el.update();

    return el;
}


const $progress = document.getElementById("progress");

$hitlist.appendChild(new Hitlist());

// DOM events

const $drawer = document.getElementById("drawer");

const $drawerHandle = document.getElementById("drawer-handle");
$drawerHandle.onclick = function() {
    $drawer.open = true;
}

const $captureButton = document.getElementById("camera-click");
$captureButton.addEventListener("capture", e => {
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
});