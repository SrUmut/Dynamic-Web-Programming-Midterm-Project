const express = require("express");
const { PUBLIC_DIR } = require("./constants");
const { addLandmarks, getLandmarks } = require("./db");

const app = express();
const PORT = process.env.PORT;

app.use(express.static(PUBLIC_DIR));

app.get("/", (req, res) => {
    res.statusCode = 200;
    res.contentType = "text/plain";
    res.send("Hello, World!");
});

app.post("/api/landmarks", express.json(), (req, res) => {
    console.log(req.body);
    addLandmarks(req.body);
    res.json(req.body);
});

app.get("/api/landmarks", (req, res) => {
    res.json(getLandmarks());
});

app.listen(PORT, () => {
    console.log(`Server listenin on port: ${PORT}`);
});
