const users = require('./data/users');
const campaigns = require('./data/campaigns');
const notes = require('./data/notes');

const router = require('express').Router();

// Authenticate a User
router.post('/authenticate', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = Object.values(users).find(user => user.email === email && user.password === password);
    if (user) {
        res.json(user);
    } else {
        res.status(401).json({"error": "Email or password are incorrect."});
    }
});

//Add a user
router.post('/users', (req, res) => {

});

//Retrieve a user's campaigns
router.get('/users/:userId/campaigns', (req, res) => {
    const userId = parseInt(req.params.userId);
    console.log(campaigns[1].userIds);
    const results = Object.values(campaigns).filter(campaign => !userId || campaign.userIds.includes(userId));

    let campaignArray = [];
    results.forEach(campaign => {
        campaignArray.push(campaign);
    });
    res.json(campaignArray);
});

//retrieve a user by id
router.get('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    const user = users[userId];

    if(user) {
        res.json(user);
    } else {
        res.status(401).json({"error" : "User not found"});
    }
});

//Retrieve a campaign by id
router.get('/campaigns/:campaignId', (req, res) => {
    const campaignId = parseInt(req.params.campaignId);
    const campaign = campaigns[campaignId];
    if(campaign) {
        res.json(campaign);
    } else {
        res.status(401).json({"error" : "Campaign not found"});
    }
});

module.exports = router;