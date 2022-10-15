let express = require("express");
let api = require("./src/api.js");
let app = express();

app.get("/", function (req, res) {
    res.send("Hello World");
});

app.get("/login", async function (req, res) {
    login = await api.login("test", "test");
    res.send(login.data);
});

let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;

    console.log("Kicktipp REST API listing at http://%s:%s", host, port);
});
