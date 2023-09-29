// ==========================
// CRUD Operations
// ==========================

// Add Influencer
function addInfluencer(db, data, callback) {
    const stmt = db.prepare("INSERT INTO influencer (name, age, gender, instagram_handle, niche, follower_count, avg_likes, avg_comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    stmt.run([data.name, data.age, data.gender, data.handle, data.niche, data.follower_count, data.avg_likes, data.avg_comments], callback);
    stmt.finalize();
}

// Search Influencers
function searchInfluencersByCriteria(db, searchQuery, minFollowers, maxFollowers, niche, minAge, maxAge, gender, callback) {
    let query = "SELECT * FROM influencer WHERE 1=1";
    let parameters = [];

    if(searchQuery) {
        query += " AND name LIKE ?";
        parameters.push(`%${searchQuery}%`);
    }

    if(minFollowers !== undefined && maxFollowers !== undefined) {
        query += " AND follower_count BETWEEN ? AND ?";
        parameters.push(minFollowers, maxFollowers);
    }

    if(niche) {
        query += " AND niche LIKE ?";
        parameters.push(`%${niche}%`);
    }

    if(minAge !== undefined && maxAge !== undefined) {
        query += " AND age BETWEEN ? AND ?";
        parameters.push(minAge, maxAge);
    }

    if(gender) {
        query += " AND gender = ?";
        parameters.push(gender);
    }

    /*
    //Databse logging
    console.log("Executing query:", query);
    console.log("With parameters:", parameters);
    */

    db.all(query, parameters, callback);
}


// Clear Database
function clearDatabase(sb, callback) {
    db.run("DELETE FROM influencer", callback);
}

module.exports = {
    addInfluencer,
    searchInfluencersByCriteria,
    clearDatabase
};