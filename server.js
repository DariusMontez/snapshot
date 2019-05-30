/*
 * DEVELOPMENT SERVER
 * ==============
 * Usage
 * > node server.js
 * > PORT=6000 node server.js
 */

const express = require(`express`);
const app = express();

app.use(express.static(`public`));

// log requests
// app.use(function(req, res, next) {
//     console.log(`${req.method} ${req.path}`);
//     next(null);
// });

// log errors
// app.use(function(err, req, res, next) {
//     console.error(`${err}`);
//     next(err);
// });

// start server on specified port
const port = process.env.PORT || 3000;
const server = app.listen(port, function() {
    console.log(`Development server started on port ${port}`);
});

module.exports = server;