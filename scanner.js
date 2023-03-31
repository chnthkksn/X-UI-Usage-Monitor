const sqlite = require("sqlite3").verbose();
const fs = require("fs");

const dbList = fs.readdirSync("./dbs");
dbList.pop();

let data = [];

const query = (db, email) => {
    return new Promise((resolve, reject) => {
        const dbPath = `./dbs/${db}`;
        const dbConn = new sqlite.Database(dbPath, (err) => {
        if (err) {
            reject(err);
        }
        });
        dbConn.all(
        `SELECT * FROM client_infos WHERE email = "${email}"`,
        (err, rows) => {
            if (err) {
            reject(err);
            }
            resolve(rows);
        }
        );
    });
};

const fetchInfo = async (email) => {
    data = [];
    for (const db of dbList) {
        const rows = await query(db, email);
        if (rows.length > 0) {
        data.push(rows[0]);
        }
    }
    return data;
};

module.exports = {
  fetchInfo,
};
