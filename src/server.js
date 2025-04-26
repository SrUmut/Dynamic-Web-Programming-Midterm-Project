const express = require("express");
const { PUBLIC_DIR, STATUS_CODE } = require("./constants");
const {
    addLandmarks,
    getLandmarks,
    getLandmark,
    updateLandmark,
    deleteLandmark,
} = require("./db");

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
    res.status(STATUS_CODE.CREATED).json(req.body);
});

app.get("/api/landmarks", (req, res) => {
    res.set("Content-Type", "application/json; charset=utf-8");
    res.status(STATUS_CODE.OK).json(getLandmarks());
});

app.get("/api/landmarks/:id", (req, res) => {
    res.set("Content-Type", "application/json; charset=utf-8");
    const landmark = getLandmark(req.params.id);
    if (landmark) res.status(STATUS_CODE.OK).json(landmark);
    else
        res.status(STATUS_CODE.BAD_REQUEST).json({
            message: `No landmark exists with the ID ${req.params.id}.`,
        });
});

app.put("/api/landmarks/:id", express.json(), (req, res) => {
    let info;
    try {
        info = updateLandmark(req.params.id, req.body);
    } catch {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
    if (info.changes === 0)
        res.status(STATUS_CODE.BAD_REQUEST).json({
            message: `No landmark exists with the ID ${req.params.id}.`,
        });
    else
        res.status(STATUS_CODE.OK).json({
            message: `Updated landmark with the ID ${req.params.id}`,
        });
});

app.delete("/api/landmarks/:id", (req, res) => {
    const info = deleteLandmark(req.params.id);
    if (info.changes === 0)
        res.status(STATUS_CODE.BAD_REQUEST).json({
            message: `No landmark exists with the ID ${req.params.id}.`,
        });
    else
        res.status(STATUS_CODE.OK).json({
            message: `Deleted landmark with the ID ${req.params.id}`,
        });
});

app.listen(PORT, () => {
    console.log(`Server listenin on port: ${PORT}`);
});
