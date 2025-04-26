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

module.exports = { addLandmarks, getLandmarks };
