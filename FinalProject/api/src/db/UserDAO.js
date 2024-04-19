const crypto = require('crypto');
const users = require('./data/users.json'); // getting rid of him later
const db = require('./DBConnection');
const User = require('./models/User');

const hashingRounds = 100000
const keyLen = 64

//This file mimics making asynchronous request to a database

function getUserByCredentials(email, password) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user WHERE usr_email=?', [email]).then(({ results }) => {
            if(results.length === 0) {
                reject({ code: 401, message: "Invalid email or password" });
            }
            
            const user = new User(results[0]);
            if (user) { // we found our user
                crypto.pbkdf2(password, user.salt, hashingRounds, keyLen, 'sha512', (err, derivedKey) => {
                    if (err) { //problem computing digest, like hash function not available
                        reject({ code: 400, message: "Error: " + err });
                    }

                    const digest = derivedKey.toString('hex');
                    if (user.password == digest) {
                        resolve(getFilteredUser(user));
                    }
                    else {
                        reject({ code: 401, message: "Invalid email or password" });
                    }
                });
            }
            else { // if no user with provided email

                reject({ code: 401, message: "Invalid email or password" });
            }
        })
    });
}

function createUser(user) {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(32).toString('hex');
        crypto.pbkdf2(user.password, salt, hashingRounds, keyLen, 'sha512', (err, hashedPassword) => {
            if (err) {
                reject({ code: 500, message: "Error hashing password" });
            } else {
    
                const hashPw = hashedPassword.toString('hex');
                
                db.query('SELECT * FROM user WHERE usr_email = ?', [user.email]).then((result) => {

                    if(result.results.length > 0) {
                        reject({code: 409, message: "Email has already been registered"});
                    }
                }).catch((err) => {
                    reject({ code: 500, message: err });
                });
                
                return db.query('INSERT INTO user (usr_email, usr_first_name, usr_last_name, usr_password, usr_salt) VALUES (?, ?, ?, ?, ?)',
                    [user.email, user.firstName, user.lastName, hashPw, salt]).then((results) => {
                        if(err) {
                            reject({ code: 500, message: "Internal server error" });
                        }
                        
                        getUserById(results.insertId).then(user => {
                            resolve(user);
                        })
                }).catch((err) => {
                    reject({ code: 500, message: "Internal server error" });
                });
            }
        });
    });
    
}

function updateUser(user) {
    return db.query(`UPDATE user
    SET usr_first_name=?, usr_last_name=?, usr_icon=?
    WHERE usr_id=?;`, [user.first_name, user.last_name, user.icon, user.userId]).then(({results}) => {
        //console.log("RESULTS", results);
        return user;
    }).catch(err => {
        reject({code: err.code, message: err.message});
    });;
}

// SHOULD THIS ALSO DELETE NOTES??? for now it doesnt
function removeUserFromCampaign(userId, campaignId) {
    return db.query('DELETE FROM campaign_user WHERE cpu_cpn_id=? AND cpu_usr_id=?;', [campaignId, userId]).then(({results}) => {
        return results; // ?????
    })
}

function getUserById(userId) {
    return db.query('SELECT * FROM user WHERE usr_id=?;', [userId]).then(({ results }) => {
        if (results[0]) {
            return new User(results[0]);
        } else {
            return null;
        }
    });
}

function getFilteredUser(user) {
    console.log(user);
    return {
        "userId": user.userId,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "email": user.email,
    }
}

module.exports = {
    getUserByCredentials,
    createUser,
    updateUser,
    removeUserFromCampaign,
    getUserById
};