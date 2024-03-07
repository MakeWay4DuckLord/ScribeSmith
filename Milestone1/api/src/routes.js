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
    // mock data implementation
    const userId = req.body.userId;
    const user = users[userId];
    if (user) {
        res.status(400).json({ "error": "User already exists" });
    } else {
        users[userId] = req.body;
        res.status(200).json({"message": "success"}); // TODO: change him?????
    }
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
    // TODO: remove the !userId from the filtering, it shouldnt be necessary
    const results = Object.values(campaigns).filter(campaign => !userId || campaign.userIds.includes(userId));

    let campaignArray = [];
    results.forEach(campaign => {
        campaignArray.push(campaign);
    });
    res.json(campaignArray);
});

//Join a user to a campaign
router.put('/users/:userId/campaigns', (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = users[userId];
    if (!user) {
        res.status(401).json({ "error": "User not found" });
        return;
    }

    // get campaign join code from request body
    const joinCode = req.body.joinCode;
    const result = Object.values(campaigns).find(campaign => campaign.joinCode == joinCode);
    if (!result) {
        res.status(401).json({ "error": "Campaign not found" });
        return;
    }

    // add userid to campaign list of userIds
    (campaigns[result.id]).userIds.push(userId);

    // update user's list of used tags to have a spot for this one
    (users[userId]).tags[result.id] = [];

    // return success or failure response
    res.status(200).json({"message": "success"});
});

//create a campaign
router.post('/campaigns', (req, res) => {
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
    const campaignId = parseInt(req.params.campaignId);
    const campaign = campaigns[campaignId];
    if (!campaign) {
        res.status(401).json({ "error": "Campaign not found" });
        return;
    }
    const userId = parseInt(req.params.userId);
    const index = campaign.userIds.indexOf(userId);
    if (index == -1) {
        res.status(401).json({ "error": "User not found" });
        return;
    }
    campaign.userIds.splice(index, 1);

    res.status(200).json({"message": "success"});

});

//update campaign description
router.patch('/campaigns/:campaignId/description', (req, res) => {
    const campaignId = parseInt(req.params.campaignId);
    const campaign = campaigns[campaignId];
    if (!campaign) {
        res.status(401).json({ "error": "Campaign not found" });
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
router.patch('/campaigns/:campaignId/tags', (req, res) => {
    const campaignId = parseInt(req.params.campaignId);
    const campaign = campaigns[campaignId];
    if (!campaign) {
        res.status(401).json({ "error": "Campaign not found" });
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
router.patch('/campaigns/:campaignId/banner', (req, res) => {
    const campaignId = parseInt(req.params.campaignId);
    const campaign = campaigns[campaignId];
    if (!campaign) {
        res.status(401).json({ "error": "Campaign not found" });
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
router.get('/campaigns/:campaignId/notes/users/:userId', (req, res) => {
    // note - this request will always need to filter out non-viewable notes
    // based on authentication
    const campaignId = parseInt(req.params.campaignId);
    const campaign = campaigns[campaignId];
    if (!campaign) {
        res.status(401).json({ "error": "Campaign not found" });
        return;
    }
    // user id check - unclear if necessary.
    // will probably get changed out when we add authentication anyway so w/e
    const userId = parseInt(req.params.userId);
    const user = users[userId];
    if (!user) {
        res.status(401).json({ "error": "User not found" });
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
router.get('/users/:userId/tags/campaigns/:campaignId', (req, res) => {

});

//create a note
router.post('/campaign/:campaignId/notes/users/:userId', (req, res) => {

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