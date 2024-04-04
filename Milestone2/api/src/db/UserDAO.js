const crypto = require('crypto');
const users = require('./data/users.json');

const hashingRounds = 100000
const keyLen = 64

//This file mimics making asynchronous request to a database
module.exports = {
  getUserByCredentials: (email, password) => {
    return new Promise((resolve, reject) => {
      const user = Object.values(users).find(user => user.email == email);
      if (user) { // we found our user
        crypto.pbkdf2(password, user.salt, hashingRounds, keyLen, 'sha512', (err, derivedKey) => {
          if (err) { //problem computing digest, like hash function not available
            reject({code: 400, message: "Error: " +err});
          }

          const digest = derivedKey.toString('hex');
          if (user.password == digest) {
            resolve(getFilteredUser(user));
          }
          else {
            reject({code: 401, message: "Invalid email or password"});
          }
        });
      }
      else { // if no user with provided email
        
        reject({code: 401, message: "Invalid email or password"});
      }
    })

  },

  createNewUser: (email, password) => {
    return new Promise((resolve, reject) => {
    const user = Object.values(users).find(user => user.email === email);

    if (user) { //email is already being used
      reject({ code: 409, message: "Email already in use" });

    } else { //email is not being used - create user
      const salt = crypto.randomBytes(32).toString('hex');
      
      crypto.pbkdf2(password, salt, hashingRounds, keyLen, 'sha512', (err, hashedPassword) => {

      if (err) {
        reject({ code: 500, message: "Error hashing password" });

      } else {
        const newUser = {
          hashedPassword: hashedPassword.toString('hex'),
          salt: salt
        };
        resolve(newUser);
      }
    });
  }});
}};

function getFilteredUser(user) {
  console.log(user);
  return {
    "userId": user.userId,
    "firstName": user.first_name,
    "lastName": user.last_name,
    "email": user.email,
    "icon": user.icon
  }
}