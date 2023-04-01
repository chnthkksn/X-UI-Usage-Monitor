const sqlite = require("sqlite3").verbose();
const fs = require("fs");

const hosts = require('./hosts');
const dbList = fs.readdirSync("./dbs");
dbList.splice(dbList.indexOf("temp"), 1);

let data = [];

const query = (db, email) => {
    return new Promise((resolve, reject) => {
        const dbname = db.split(".")[0];
        const table = hosts[dbname].table;
        const dbPath = `./dbs/${db}`;
        const dbConn = new sqlite.Database(dbPath, (err) => {
        if (err) {
            reject(err);
        }
        });
        dbConn.all(
        `SELECT * FROM ${table} WHERE email = "${email}"`,
        (err, rows) => {
            if (err) {
            reject(err);
            }
            resolve(rows);
        }
        );
        dbConn.close();
    });
};

const all = (db) => {
    return new Promise((resolve, reject) => {
        const dbname = db.split(".")[0];
        const table = hosts[dbname]['table'];
        const dbPath = `./dbs/${db}`;
        const dbConn = new sqlite.Database(dbPath, (err) => {
        if (err) {
            reject(err);
        }
        });
        dbConn.all(`SELECT * FROM ${table}`, (err, row) => {
            if (err) {
            reject(err);
            }
            resolve(row);
        });
        dbConn.close();
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

const fetchAll = async () => {
    data = [];
    for (const db of dbList) {
        const rows = await all(db);
        if (rows.length > 0) {
        data.push({ db, rows });
        }
    }
    return data;
}

module.exports = {
  fetchInfo, fetchAll
};
