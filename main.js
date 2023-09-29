// ==========================
// 1. Initialization
// ==========================

const express = require('express');
const { app, BrowserWindow } = require('electron');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const influencerRoutes = require('./routes');
const dbOperations = require('./dbOperations');

const serverApp = express();
serverApp.use(bodyParser.urlencoded({ extended: true }));
serverApp.use(express.static('public'));

const db = new sqlite3.Database('influencers.db');
serverApp.use('/', influencerRoutes(db));
const PORT = 3000;

// Set up the table structure
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS influencer (
        id INTEGER PRIMARY KEY,
        name TEXT,
        age INTEGER,
        gender TEXT,
        instagram_handle TEXT,
        niche TEXT,
        follower_count INTEGER,
        avg_likes INTEGER,
        avg_comments INTEGER
    )`);
});

// ==========================
// 3. Electron Window and Server Setup
// ==========================

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(`http://localhost:${PORT}`);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', () => {
    createWindow();

    serverApp.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});

// ==========================
// 4. Event Listeners
// ==========================

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

