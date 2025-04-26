const express = require("express");
const { PUBLIC_DIR, STATUS_CODE } = require("./constants");
const {
    addLandmark,
    getLandmarks,
    updateLandmark,
    getLandmark,
    delete_landmark,
    addVisitedLandmark,
    getVisitedLandmarks,
    getVisitedLandmark,
} = require("./db");

const app = express();
const PORT = process.env.PORT;

app.use(express.static(PUBLIC_DIR));

app.post("/api/landmarks", express.json(), (req, res) => {
    for (let landmark of req.body.landmarks)
        addLandmark(landmark, req.body.note);
    res.status(STATUS_CODE.CREATED).json({ message: "Landmark(s) added." });
});

app.get("/api/landmarks", (req, res) => {
    res.status(STATUS_CODE.OK).json(getLandmarks());
});

app.get("/api/landmarks/:id", (req, res) => {
    const landmark = getLandmark(req.params.id);
    if (!landmark)
        res.status(STATUS_CODE.BAD_REQUEST).json({
            message: `No Landmark with the ID ${req.params.id}.`,
        });
    else res.status(STATUS_CODE.OK).json(landmark);
});

app.put("/api/landmarks/:id", express.json(), (req, res) => {
    updateLandmark(req.body);
});

app.delete("/api/landmarks/:id", (req, res) => {
    const info = delete_landmark(req.params.id);
    if (info.changes === 0)
        res.status(STATUS_CODE.BAD_REQUEST).json({
            message: `No Landmark with the ID ${req.params.id}.`,
        });
    else res.status(STATUS_CODE.OK).end();
});

app.post("/api/visited", express.json(), (req, res) => {
    for (let landmark of req.body) addVisitedLandmark(landmark);
    res.status(STATUS_CODE.CREATED).json({ message: "Landmark(s) added." });
});

app.get("/api/visited", (req, res) => {
    res.status(STATUS_CODE.OK).json(getVisitedLandmarks());
});

app.get("/api/visited/:id", (req, res) => {
    const landmark = getVisitedLandmark(req.params.id);
    if (!landmark)
        res.status(STATUS_CODE.BAD_REQUEST).json({
            message: `No Landmark with the ID ${req.params.id}.`,
        });
    else res.status(STATUS_CODE.OK).json(landmark);
});

app.listen(PORT, () => {
    console.log(`Server listenin on port: ${PORT}`);
});
