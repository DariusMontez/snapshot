// Data Model

const Team = {
    create({name, photoURL, snaps=[]}) {
        return {
            name,
            photoURL,
            snaps, // [Team]
        };
    }
};

let data = {
    teams: [
        {name: "Will + Joe", photoURL: "http://lorempixel.com/48/48"},
        {name: "Sam + Bob", photoURL: "http://lorempixel.com/48/48"},
        {name: "Rob + Jef", photoURL: "http://lorempixel.com/48/48"},
        {name: "Tom + Sue", photoURL: "http://lorempixel.com/48/48"},
        {name: "Terry + Pam", photoURL: "http://lorempixel.com/48/48"},
        {name: "Mac + Mat", photoURL: "http://lorempixel.com/48/48"},
        {name: "Claire + Jim", photoURL: "http://lorempixel.com/48/48"},
        {name: "Riley + Josh", photoURL: "http://lorempixel.com/48/48"},
    ].map(Team.create),
}

// populate UI with data

const me = data.teams[0];
me.snaps = ["Tom + Sue", "Mac + Mat"];

const _ = uiElement;

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

