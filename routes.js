const express = require('express');
const router = express.Router();
const dbOperations = require('./dbOperations');  
const path = require('path');

// ==========================
// Routes
// ==========================

module.exports = function (db) {

    // Serve the main index.html page
    router.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'index.html'));
    });

    // Serve the Add Influencer page
    router.get('/add-influencer', (req, res) => {
        res.sendFile(path.join(__dirname, 'views','add-influencer.html')); // Updated this line
    });

    // Serve the Search page
    router.get('/search', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'search.html'));
    });

    // Handle clearing the database
    router.get('/clear-db', (req, res) => {
        dbOperations.clearDatabase(db, (err) => {
            if (err) {
                return console.error(err.message);
            }
            res.send('Database cleared!');
        });
    });

    // Handle search request
    router.post('/search-influencers', (req, res) => {
        
        // Name Parameters
        const searchQuery = req.body.searchQuery ? req.body.searchQuery.trim() : "";
        
        // Follower Range Parameters
        const minFollowers = parseInt(req.body.minFollowers, 10) || 0;
        const maxFollowers = parseInt(req.body.maxFollowers, 10) || 1000000;
        
        // Niche Parameters
        const niche = req.body.niche ? req.body.niche.trim() : "";
        //console.log("Received niche:", niche);

        // Age Parameters
        const minAge = parseInt(req.body.minAge, 10) || 0;
        const maxAge = parseInt(req.body.maxAge, 10) || 100;
    
        // Gender Parameters
        const gender = req.body.gender;

        dbOperations.searchInfluencersByCriteria(db, searchQuery, minFollowers, maxFollowers, niche, minAge, maxAge, gender, (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
        
            // If no results found, send a message to inform the user
            if (rows.length === 0) {
                return res.send("No influencers found.");
            }
        
            // Start of the HTML structure
            let resultHTML = `
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="./css/search-result.css">
                <title>Search Results</title>
            </head>
            <body>
            `;
        
            // Append the search results to the HTML
            resultHTML += rows.map(row => `
                <div class="influencer-card">
                    <h3>${row.name}</h3>
                    <img src="path_to_image" alt="${row.name}'s profile picture" class="profile-pic"> <!-- Add the image source -->
                    <div class="details-wrapper">
                        <div class="left-details">
                            <p>Instagram: ${row.instagram_handle}</p>
                            <p>Age Range: ${row.age}</p>
                            <p>Gender: ${row.gender}</p>
                            <p>Niche: ${row.niche}</p>
                        </div>
                        <div class="right-details">
                        <p>Follower Count: ${Number(row.follower_count).toLocaleString()}</p>
                        <p>Average Likes: ${Number(row.avg_likes).toLocaleString()}</p>
                        <p>Average Comments: ${Number(row.avg_comments).toLocaleString()}</p>
                        </div>
                    </div>
                </div>       
            `).join('');
            
            // Add a "Go Back" button at the end
            resultHTML += `
            <div class="back-button-wrapper">
                <a href="/search" class="btn go-back-btn">Go Back</a>
            </div>
            `;
            
            // End of the HTML structure
            resultHTML += `
            </body>
            </html>
            `;
        
            res.send(resultHTML);
        });        
    });

    // Handle Add Influencer form submission
    router.post('/add-influencer', (req, res) => {
        const data = req.body;
    
        dbOperations.addInfluencer(db, data, (err) => {
            if (err) {
                console.error(err.message);
                return res.send('<script>alert("Failed to add influencer!"); window.location="/";</script>');
            }
    
            const name = data.name; // Extract the name from the submitted data
            res.send(`<script>alert("${name} has been added to the database!"); window.location="/";</script>`);
        });
    });

    return router;
};
