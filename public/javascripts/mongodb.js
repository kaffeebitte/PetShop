const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'mydatabase';
const collectionName = 'DoDungThuCung';
let client;
let db;

async function connectDB() {
    if (db) return { client, db }; // Return existing connection if available
    try {
        client = new MongoClient(url);
        await client.connect();
        console.log("Đã kết nối thành công đến máy chủ MongoDB");
        db = client.db(dbName);
        return { client, db };
    } catch (error) {
        console.error("Không thể kết nối đến MongoDB:", error);
        process.exit(1); // Exit the process if DB connection fails
    }
}

function getCollection() {
    if (!db) {
        throw new Error("Cơ sở dữ liệu chưa được kết nối. Hãy gọi connectDB trước.");
    }
    return db.collection(collectionName);
}

module.exports = { connectDB, getCollection, dbName, collectionName }; // Export client as well if needed elsewhere, but usually db is enough