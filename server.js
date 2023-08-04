const http = require("http");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("my_database.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )`);
});

db.run(`INSERT INTO data (name) VALUES ("John Doe")`);

http
  .createServer((req, res) => {
    // Set CORS headers to allow requests from any origin
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    db.all("SELECT * FROM data", (err, rows) => {
      res.end(JSON.stringify(rows));
    });
  })
  .listen(5500, () => console.log("Server running on port 5500"));
