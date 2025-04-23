const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DB_DIR = path.join(ROOT_DIR, "db");

module.exports = { ROOT_DIR, PUBLIC_DIR, DB_DIR };
