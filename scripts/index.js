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
me.snaps = ["Tom + Sue", "Mac + Mat"];

const $hitlist = document.getElementById("hitlist");

$hitlist.renderRow = function({team, isSnapped}) {
    if (isSnapped) {
        return _("li", {class: "snapped"},
            team.name,
            _("img", {src: team.photoURL, class: "circle"}),
            _("i", {class: "material-icons check-overlay", check_circle: ""}, "check_circle"),
        );

    }  else {
        return _("li", {},
            team.name,
            _("img", {src: team.photoURL, class: "circle"}),
        );
    }
}

$hitlist.render = function(me, teams) {
    const ul = this.querySelector("ul");
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    for (let team of teams) {
        const row = this.renderRow({
            team,
            isSnapped: me.snaps.includes(team.name)
        });

        ul.appendChild(row);
    }
}

const otherTeams = data.teams.filter(t => t.name != me.name);

$hitlist.render(me, otherTeams);

const $progress = document.getElementById("progress");
$progress.textContent = `${me.snaps.length} / ${otherTeams.length}`;

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