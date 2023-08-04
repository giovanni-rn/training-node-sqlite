const http = require("http");
const sqlite3 = require("sqlite3").verbose();

// Créer ou ouvrir la base de données SQLite
const db = new sqlite3.Database("my_database.db", (err) => {
  if (err) console.error(err.message);
  console.log("Connected to the database.");
});

// Créer une table pour stocker les données
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      age INTEGER
    )`);
});

// Fonction pour insérer des données dans la base de données
const insertData = (name, age) => {
  db.run(`INSERT INTO data (name, age) VALUES (?, ?)`, [name, age], (err) => {
    if (err) console.error(err.message);
    else console.log(`Data inserted with ID: ${this.lastID}`);
  });
};

// Insérer quelques données de test (à supprimer en production)
insertData("John Doe", 30);
insertData("Jane Smith", 25);

// Créer le serveur HTTP
const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    if (req.url === "/api/data") {
      // Récupérer les données depuis la base de données
      db.all("SELECT * FROM data", [], (err, rows) => {
        if (err) {
          console.error(err.message);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(rows));
        }
      });
    } else {
      // Gérer les autres requêtes GET
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  } else {
    // Gérer les autres méthodes HTTP
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("Method Not Allowed");
  }
});

// Démarrer le serveur sur le port 3000
server.listen(3000, () => console.log("Server running on port 3000"));
