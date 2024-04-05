const router = require('express').Router();
const users = require('./data/users');
const campaigns = require('./data/campaigns');
const notes = require('./data/notes');
const path = require('path');

const {TokenMiddleware, generateToken, removeToken} = require('../middleware/TokenMiddleware');
const upload = require('../middleware/multerConfig');
const UserDAO = require('./UserDAO');

// Authenticate a User
router.post('/authenticate', (req, res) => {
    if(req.body.email && req.body.password) {
        UserDAO.getUserByCredentials(req.body.email, req.body.password).then(user => {
          let result = {
            user: user
          }
    
          generateToken(req, res, user);
    
          res.json(result);
        }).catch(err => {
          console.log(err);
          res.status(err.code).json({error: err.message});
        });
      }
      else {
        res.status(401).json({error: 'Not authenticated'});
      }
});

//Logout the current authenticated user
router.post('/users/logout', (req,  res) => {
    removeToken(req, res);  
    res.json({success: true});
});

//Add a user
router.post('/users', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    if(firstName && lastName && email && password) {
        UserDAO.createNewUser(email, password).then(results => {
            const newUser = {
                "id": Object.keys(users).length + 1,
                "first_name": firstName,
                "last_name": lastName,
                "email": email,
                "icon": "",
                "tags": [],
                "salt": results.salt,
                "password": results.hashedPassword,
            }
            const usersNewId = Object.keys(users).length + 1;
            users[usersNewId] = newUser;

            res.json({success: true});
        }).catch(err => {
            console.log(err);
            res.status(err.code).json({error: err.message});
        });
    } else {
        res.status(400).json({error: "All fields must be filled out."});
    }
});

//Getting the currently authenticated user
router.get('/users/current', TokenMiddleware, (req,res) => {
    res.json(req.user);
});

//retrieve a user by id
router.get('/users/:userId', TokenMiddleware, (req, res) => {
    const userId = req.params.userId;
    const user = users[userId];

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ "error": "User not found" });
    }
});

//Update a User
//User has the ability to update their first/last name and their profile image icon
router.put('/users/:userId', TokenMiddleware, upload, (req, res) => {
    const userId = req.params.userId;
    const user = users[userId];

    if(!user) {
        res.status(404).json({ "error": "User not found" });
        return;
    }

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    if(!(firstName) || !(lastName)) {
        res.status(400).json({ "error": "Not all fields filled out" });
        return;
    }
    console.log(req.file);
    let imageURL = "";
    if (!req.file) { //no image was uploaded
        imageURL = user.icon;
    } else {
        imageURL = `${req.file.path}`; 
    }

    const updatedUser = {
        userId: user.userId,
        first_name: firstName,
        last_name: lastName,
        email: user.email,
        icon: imageURL,
        tags: user.tags,
        salt: user.salt,
        password: user.password,
    }

    users[user.userId] = updatedUser; //update in "Database"

    const filteredUser = {
        userId: updatedUser.userId,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        email: updatedUser.email,
    }

    //update the token with the new user info
    removeToken(req, res);
    generateToken(req, res, filteredUser);
    res.json(filteredUser);
});

//Retrieve a user's profile icon
router.get('/users/:userId/icon', TokenMiddleware, (req, res) => {
    const userId = req.params.userId;
    const user = users[userId];

    if(!user) {
        res.status(404).json({ "error": "User not found" });
        return;
    }
    const filePath = path.join(__dirname, '..', '..', user.icon);
    res.sendFile(filePath);
});

//Retrieve a user's campaigns
router.get('/users/:userId/campaigns', TokenMiddleware, (req, res) => {
    const userId = parseInt(req.params.userId);

    const results = Object.values(campaigns).filter(campaign => campaign.userIds.includes(userId));

    let campaignArray = [];
    results.forEach(campaign => {
        campaignArray.push(campaign);
    });
    res.json(campaignArray);
});

//Join a user to a campaign
router.put('/users/:userId/campaigns', TokenMiddleware, (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = users[userId];
    if (!user) {
        res.status(404).json({ "error": "User not found" });
        return;
    }

    // get campaign join code from request body
    const joinCode = req.body.joinCode;
    const campaign = Object.values(campaigns).find(campaign => campaign.joinCode == joinCode);
    if (!campaign) {
        res.status(404).json({ "error": "Campaign not found" });
        return;
    }
    //check if a user is already in a campaign
    console.log(campaign["userIds"]);
    if(campaign["userIds"].includes(userId)) {
        res.status(400).json({"error": "You have already joined this campaign."});
        return;
    }

    // add userid to campaign list of userIds
    (campaigns[campaign.id]).userIds.push(userId);

    // update user's list of used tags to have a spot for this one
    console.log(users[userId]);
    (users[userId]).tags[campaign.id] = [];

    // return success or failure response
    res.status(200).json({"message": "success"});
});

//create a campaign
router.post('/campaigns', TokenMiddleware, (req, res) => {
    // request body should include name, description, banner
    // id and join code are generated
    // owner is the current auth'd user? but req body for NOW
    // userIds and tags are empty at the start
    const newCampaign = {};
    newCampaign.id = Math.max(...Object.keys(campaigns)) + 1;
    newCampaign.joinCode = makeJoinCode(5);
    while (Object.values(campaigns).find(campaign => campaign.joinCode == newCampaign.joinCode) != undefined) {
        newCampaign.joinCode = makeJoinCode(5);
    }
    // TODO: make sure all fields are validated!
    newCampaign.ownerId = req.body.ownerId;
    newCampaign.name = req.body.name;
    newCampaign.description = req.body.description;
    newCampaign.banner = req.body.banner;
    newCampaign.userIds = [];
    newCampaign.tags = [];

    campaigns[newCampaign.id] = newCampaign;

    // return success or failure response
    res.status(200).json({"message": "success"});
});

//Retrieve a campaign by id
router.get('/campaigns/:campaignId', TokenMiddleware, (req, res) => {
    const campaignId = parseInt(req.params.campaignId);
    const campaign = campaigns[campaignId];
    if (campaign) {
        res.json(campaign);
    } else {
        res.status(404).json({ "error": "Campaign not found" });
    }
});

//remove a player from a campaign
router.delete('/campaigns/:campaignId/users/:userId', TokenMiddleware, (req, res) => {
    const campaignId = parseInt(req.params.campaignId);
    const campaign = campaigns[campaignId];
    if (!campaign) {
        res.status(404).json({ "error": "Campaign not found" });
        return;
    }
    const userId = parseInt(req.params.userId);
    const index = campaign.userIds.indexOf(userId);
    if (index == -1) {
        res.status(404).json({ "error": "User not found" });
        return;
    }
    campaign.userIds.splice(index, 1);

    res.status(200).json({"message": "success"});

});

//update campaign description
router.patch('/campaigns/:campaignId/description', TokenMiddleware, (req, res) => {
    const campaignId = parseInt(req.params.campaignId);
    const campaign = campaigns[campaignId];
    if (!campaign) {
        res.status(404).json({ "error": "Campaign not found" });
        return;
    }
    if (req.body.description == undefined || req.body.description == "") {
        res.status(400).json({ "error": "Invalid description" });
        return;
    }
    campaign.description = req.body.description;
    res.status(200).json({"message": "success"});
});

//update campaign tags
router.patch('/campaigns/:campaignId/tags', TokenMiddleware, (req, res) => {
    const campaignId = parseInt(req.params.campaignId);
    const campaign = campaigns[campaignId];
    if (!campaign) {
        res.status(404).json({ "error": "Campaign not found" });
        return;
    }
    if (req.body.tags == undefined || !Array.isArray(req.body.tags)) {
        res.status(400).json({ "error": "Invalid tags list" });
        return;
    }
    campaign.tags = req.body.tags;
    res.status(200).json({"message": "success"});
});

//update banner image
router.patch('/campaigns/:campaignId/banner', TokenMiddleware, (req, res) => {
    const campaignId = parseInt(req.params.campaignId);
    const campaign = campaigns[campaignId];
    if (!campaign) {
        res.status(404).json({ "error": "Campaign not found" });
        return;
    }
    if (req.body.banner == undefined || req.body.banner == "") {
        res.status(400).json({ "error": "Invalid banner image link" });
        return;
    }
    campaign.banner = req.body.banner;
    res.status(200).json({"message": "success"});
});

//get notes by creator and campaign (could this be removed?)
router.get('/campaigns/:campaignId/notes/users/:userId', TokenMiddleware, (req, res) => {
    // note - this request will always need to filter out non-viewable notes
    // based on authentication
    const campaignId = parseInt(req.params.campaignId);
    const campaign = campaigns[campaignId];
    if (!campaign) {
        res.status(404).json({ "error": "Campaign not found" });
        return;
    }

    // user id check - unclear if necessary.
    // will probably get changed out when we add authentication anyway so w/e
    const userId = parseInt(req.params.userId);
    const user = users[userId];
    if (!user) {
        res.status(404).json({ "error": "User not found" });
        return;
    }

    if(!campaign.userIds.includes(userId)) {
        res.status(401).json({ "error": "Not authorized to view this campaign's notes" });
        return;
    }


    const results = Object.values(notes).filter(note => (note.campaignId == campaignId) && (note.userId == userId));

    res.json(results);

});

//get notes by creator and campaign and tags
router.get('/campaigns/:campaignId/notes/users/:userId/tags/:tagString', (req, res) => {
    // TODO: this url seems a little fucked up but if i don't put
    // tags as a url parameter then it has to go in the body
    // which is supposed to be empty
    // soooooooooooooooo

    // NOT DOING THIS ONE currently bc declan has pitched
    // that we filter by tags in frontend instead
});

//get all tags a user has used in a campaign
router.get('/users/:userId/tags/campaigns/:campaignId', TokenMiddleware, (req, res) => {

});

//create a note
router.post('/campaigns/:campaignId/notes', TokenMiddleware, (req, res) => {
    console.log("post request received");
});

//update a note
router.put('/campaigns/:campaignId/notes/:noteId', TokenMiddleware, (req, res) => {
    console.log("put request received");
});

module.exports = router;

// helpers and stuff

function makeJoinCode(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const amtCharacters = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * amtCharacters));
    }
    return result;
}