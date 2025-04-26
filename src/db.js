const sqlite = require("better-sqlite3");
const path = require("path");
const { DB_DIR } = require("./constants");

const db = sqlite(path.join(DB_DIR, "landmarks.db"));
db.pragma("journal_mode = WAL");

db.prepare(
    `CREATE TABLE IF NOT EXISTS 'landmarks' (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    latitude REAL,
    longitude REAL,
    name TEXT,
    description TEXT,
    category TEXT
    );`
).run();

db.prepare(
    `CREATE TABLE IF NOT EXISTS 'visited_landmarks' (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visited_date DATE,
    visitor TEXT
    );`
).run();

function addLandmarks(landmark_list) {
    if (landmark_list.length <= 0) return;

    let query = `INSERT INTO landmarks (latitude, longitude, name, description, category)
    VALUES`;
    for (let i = 0; i < landmark_list.length; i++) {
        const lm = landmark_list[i];
        query +=
            `\n(${lm.latitude}, ${lm.longitude}, '${lm.name}',` +
            `'${lm.description}', '${lm.category}')`;
        if (i === landmark_list.length - 1) query += ";";
        else query += ",";
    }
    return db.prepare(query).run();
}

function getLandmarks() {
    return db.prepare(`SELECT * FROM landmarks;`).all();
}

function getLandmark(id) {
    return db.prepare(`SELECT * FROM landmarks WHERE id = ${id};`).get();
}

function updateLandmark(id, landmark) {
    let query =
        `UPDATE landmarks
        SET latitude = ${landmark.latitude}, longitude = ${landmark.longitude}, ` +
        `name = '${landmark.name}', description = '${landmark.description}',` +
        `category = '${landmark.category}'
        WHERE id = ${id}`;
    return db.prepare(query).run();
}

function deleteLandmark(id) {
    return db.prepare(`DELETE FROM landmarks WHERE id = ${id};`).run();
}

module.exports = {
    addLandmarks,
    getLandmarks,
    getLandmark,
    updateLandmark,
    deleteLandmark,
};
