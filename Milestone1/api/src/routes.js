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
        res.status(401).json({ "error": "Email or password are incorrect." });
    }
});

//Add a user
router.post('/users', (req, res) => {

});

//retrieve a user by id
router.get('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    const user = users[userId];

    if (user) {
        res.json(user);
    } else {
        res.status(401).json({ "error": "User not found" });
    }
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

//Join a user to a campaign
router.post('/users/:userId/campaigns', (req, res) => {
    const userId = parseInt(req.params.userId);
    // get campaign join code from request body
    // return success or failure response
    // TODO: apiclient method?
});

//create a campaign
router.post('/campaigns', (req, res) => {

});

//Retrieve a campaign by id
router.get('/campaigns/:campaignId', (req, res) => {
    const campaignId = parseInt(req.params.campaignId);
    const campaign = campaigns[campaignId];
    if (campaign) {
        res.json(campaign);
    } else {
        res.status(401).json({ "error": "Campaign not found" });
    }
});

//remove a player from a campaign
router.delete('/campaigns/:campaignId/users/:userId', (req, res) => {

});

//update campaign description
router.patch('campaigns/:campaignId/description', (req, res) => {

});

//update campaign tags
router.patch('campaigns/:campaignId/tags', (req, res) => {

});

//update banner image
router.patch('campaigns/:campaignId/banner', (req, res) => {

});

//get notes by creator and campaign (could this be removed?)
router.get('campaigns/:campaignId/notes/users/:userId', (req, res) => {
    // note - this request will always need to filter out non-viewable notes
    // based on authentication
});

//get notes by creator and campaign and tags
router.get('campaigns/:campaignId/notes/users/:userId/tags/:tagString', (req, res) => {
    // TODO: this url seems a little fucked up but if i don't put
    // tags as a url parameter then it has to go in the body
    // which is supposed to be empty
    // soooooooooooooooo
});

//get all tags a user has used in a campaign
router.get('/users/:userId/tags/campaigns/:campaignId', (req, res) => {

});

//create a note
router.post('/campaign/:campaignId/notes/users/:userId', (req, res) => {

});

module.exports = router;