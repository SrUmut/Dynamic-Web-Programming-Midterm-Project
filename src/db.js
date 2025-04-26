const sqlite = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const { DB_DIR } = require("./constants");

fs.mkdir("./db", { recursive: true }, (err) => {
    if (err) throw err;
});

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
    `CREATE TABLE IF NOT EXISTS visited_landmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    landmark_id REFERENCES landmarks(id) ON DELETE CASCADE,
    visited_date DATE,
    visitor TEXT
    );`
).run();

db.prepare(
    `CREATE TABLE IF NOT EXISTS notes (
    landmark_id REFERENCES landmarks(id) ON DELETE CASCADE,
    note TEXT
    );`
).run();

function addLandmark(landmark, note) {
    const info = db
        .prepare(
            `INSERT INTO landmarks (latitude, longitude, name, description, category) ` +
                `VALUES (?, ?, ?, ?, ?)`
        )
        .run(
            landmark.latitude,
            landmark.longitude,
            landmark.name,
            landmark.description,
            landmark.category
        );
    console.log(info);
    db.prepare(`INSERT INTO notes (landmark_id, note) VALUES (?, ?)`).run(
        info.lastInsertRowid,
        note
    );
}

function getLandmarks() {
    const non_visited_list = [];
    let statement = db.prepare(
        `SELECT l.* ` +
            `FROM visited_landmarks vl ` +
            `RIGHT JOIN landmarks l ON l.id = vl.landmark_id ` +
            `WHERE vl.landmark_id IS NULL;`
    );
    console.log(statement.all());
    for (let row of statement.all()) {
        console.log(row);
        const lm_statement = db.prepare(
            `SELECT id, latitude, longitude, name, description, category, note ` +
                `FROM notes ` +
                `RIGHT JOIN landmarks ON id = landmark_id ` +
                `WHERE id = ?;`
        );
        const lm = lm_statement.get(row.id);
        non_visited_list.push(lm);
    }

    statement = db.prepare(
        `SELECT l.id as id, latitude, longitude, name, description, category, visited_date, visitor ` +
            `FROM visited_landmarks vl ` +
            `INNER JOIN landmarks l ON vl.landmark_id = l.id; `
    );
    const visited_list = statement.all();
    return [...non_visited_list, ...visited_list];
}

function getLandmark(id) {
    const query =
        `SELECT l.id as id, latitude, longitude, name, description, category, visited_date, visitor, landmark_id ` +
        `FROM visited_landmarks vl ` +
        `RIGHT JOIN landmarks l ON vl.landmark_id = l.id ` +
        `WHERE l.id = ?;`;
    const landmark = db.prepare(query).get(id);
    if (!landmark) return null;
    if (landmark.landmark_id === null) {
        lm_statement = db.prepare(
            `SELECT id, latitude, longitude, name, description, category, note ` +
                `FROM notes ` +
                `RIGHT JOIN landmarks ON id = landmark_id ` +
                `WHERE id = ?;`
        );
        return lm_statement.get(landmark.id);
    } else delete landmark.landmark_id;
    return landmark;
}

function updateLandmark(landmark) {
    // update the row on landmarks table
    db.prepare(
        `UPDATE landmarks ` +
            `SET latitude = ?, longitude = ?, name = ?, description = ?, category = ? ` +
            `WHERE id = ?`
    ).run(
        landmark.latitude,
        landmark.longitude,
        landmark.name,
        landmark.description,
        landmark.category,
        landmark.id
    );
}

function delete_landmark(id) {
    return db.prepare(`DELETE FROM landmarks WHERE id = ?;`).run(id);
}

function addVisitedLandmark(landmark) {
    let statement = db.prepare(
        `INSERT INTO landmarks (latitude, longitude, name, description, category) 
        VALUES (?, ?, ?, ?, ?);`
    );
    const info = statement.run(
        landmark.latitude,
        landmark.longitude,
        landmark.name,
        landmark.description,
        landmark.category
    );
    db.prepare(
        `INSERT INTO visited_landmarks (landmark_id, visited_date, visitor) ` +
            `VALUES (?, ?, ?)`
    ).run(info.lastInsertRowid, landmark.visited_date, landmark.visitor);
}

function getVisitedLandmarks() {
    const statement = db.prepare(
        `SELECT l.id as id, latitude, longitude, name, description, category, visited_date, visitor ` +
            `FROM visited_landmarks vl ` +
            `INNER JOIN landmarks l ON vl.landmark_id = l.id; `
    );
    return statement.all();
}

function getVisitedLandmark(id) {
    const query =
        `SELECT l.id as id, latitude, longitude, name, description, category, visited_date, visitor ` +
        `FROM visited_landmarks vl ` +
        `INNER JOIN landmarks l ON vl.landmark_id = l.id ` +
        `WHERE vl.id = ?;`;
    return db.prepare(query).get(id);
}

module.exports = {
    addLandmark,
    getLandmarks,
    updateLandmark,
    getLandmark,
    delete_landmark,
    addVisitedLandmark,
    getVisitedLandmarks,
    getVisitedLandmark,
};
