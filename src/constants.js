const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DB_DIR = path.join(ROOT_DIR, "db");

const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
};

module.exports = { ROOT_DIR, PUBLIC_DIR, DB_DIR, STATUS_CODE };
