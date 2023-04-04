const sqlite = require("sqlite3").verbose();
const fs = require("fs");

const hosts = require("./hosts");
const dbList = fs.readdirSync("./dbs");
const nowTime = new Date().getTime();
dbList.splice(dbList.indexOf("temp"), 1);

let data = [];
let lastUpdatedArr = {};

// receive email and db name and return all rows with that email
const query = (db, email) => {

    try{
        for (const i of dbList) {
            const dbPath = `./dbs/${i}`;
            const lastUpdated = fs.statSync(dbPath).ctime.getTime();
            lastUpdatedArr[i] = lastUpdated;
        }
    }
    catch(err){
        console.log(`error getting last updated time of ${db} \n` + err);
    }

    try{
        return new Promise((resolve, reject) => {
            const dbname = db.split(".")[0];
            const lastUpdated = lastUpdatedArr[db];
            const table = hosts[dbname]["table"];
            const dbPath = `./dbs/${db}`;
            try {
                const dbConn = new sqlite.Database(dbPath, (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                dbConn.all(
                    `SELECT * FROM ${table} WHERE email = "${email}" COLLATE NOCASE`,
                    (err, rows) => {
                        if (err) {
                            reject(err);
                        }
                        resolve({
                            data: rows,
                            lastUpdated: lastUpdated,
                        });
                    }
                );
                dbConn.close();
            } catch (err) {
                reject(err);
            }
        });
    }
    catch(err){
        console.log('error searching user on db \n' + err);
    }
};

// receive db name and return all rows
const all = (db) => {
    try{
        return new Promise((resolve, reject) => {
            const dbname = db.split(".")[0];
            const lastUpdated = lastUpdatedArr[db];
            const table = hosts[dbname]["table"];
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
    }
    catch(err){
        console.log('error fetching all data from db \n' + err);
    }
};

//fetch info from all dbs of a certain user
const fetchInfo = async (email) => {
    data = [];
    for (const db of dbList) {
        const resp = await query(db, email);
        if (resp.data.length > 0) {
            data.push({
                data : resp.data[0],
                lastUpdated : resp.lastUpdated,
            });
        }
    }
    return data;
};

//fetch all data from all dbs
const fetchAll = async () => {
    data = [];
    for (const db of dbList) {
        const rows = await all(db);
        if (rows.length > 0) {
            data.push({ db, rows });
        }
    }
    return data;
};

module.exports = {
    fetchInfo,
    fetchAll,
};
