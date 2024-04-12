const router = require('express').Router();
const users = require('./data/users'); // goal is to get rid of these
const campaigns = require('./data/campaigns');
const notes = require('./data/notes');
const path = require('path');

const { TokenMiddleware, generateToken, removeToken } = require('../middleware/TokenMiddleware');
const upload = require('../middleware/multerConfig');
const UserDAO = require('./UserDAO');
const CampaignDAO = require('./CampaignDAO');
const NoteDAO = require('./NoteDAO');

// Authenticate a User
router.post('/authenticate', (req, res) => {
    if (req.body.email && req.body.password) {
        UserDAO.getUserByCredentials(req.body.email, req.body.password).then(user => {
            let result = {
                user: user
            }

            generateToken(req, res, user);

            res.json(result);
        }).catch(err => {
            console.log(err);
            res.status(err.code).json({ error: err.message });
        });
    }
    else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

//Logout the current authenticated user
router.post('/users/logout', (req, res) => {
    removeToken(req, res);
    res.json({ success: true });
});

//Add a user
router.post('/users', (req, res) => {
    let user = req.body;
    if(!user.email || !user.firstName || !user.lastName || !user.password) {
        res.status(404).json({error: "Please fill out all fields"});
        return;
    }

    UserDAO.createUser(user).then(newUser => {
        res.json({message: "Successfully created user."});
    }).catch(err => {
        console.log(err);
        res.status(err.code).json({ error: err.message });
    });
});

//Getting the currently authenticated user
router.get('/users/current', TokenMiddleware, (req, res) => {
    res.json(req.user);
});

//retrieve a user by id
router.get('/users/:userId', TokenMiddleware, (req, res) => {
    const userId = req.params.userId;
    UserDAO.getUserById(userId).then(user => {
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ "error": "User not found" });
        }
    })
});

// TODO: remove userId from params here!!
// TODO: add database to this
//Update a User
//User has the ability to update their first/last name, their profile image icon, and leave campaigns
router.put('/users/:userId', TokenMiddleware, upload, (req, res) => {
    const userId = req.params.userId;
    const user = users[userId];

    UserDAO.getUserById(userID).then(user => {
        if(!user) {
            res.status(409).json({"error": "User does not exist"});
            return;
        }

        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const selectedCampaigns = JSON.parse(req.body.selectedCampaigns);

        if (!(firstName) || !(lastName)) {
            res.status(400).json({ "error": "Not all fields filled out" });
            return;
        }

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
            // tags: user.tags,
            salt: user.salt,
            password: user.password,
        }

        //remove user from campaigns
        selectedCampaigns.forEach(campaignId => {
            UserDAO.removeUserFromCampaign(userId, campaignId).catch(error => {
                console.log("this method wasn't supposed to throw an error, how did you get here.");
            });
        });

        UserDAO.updateUser(updatedUser).then(userReturn => {
            const filteredUser = {
                userId: userReturn.userId,
                firstName: userReturn.first_name,
                lastName: userReturn.last_name,
                email: userReturn.email,
            }
            //update the token with the new user info
            removeToken(req, res);
            generateToken(req, res, filteredUser);
            res.json(filteredUser);
        }).catch(err => {
            console.log(err);
            res.status(err.code).json({ error: err.message });
        });

    });
});

//Retrieve a user's profile icon
router.get('/users/:userId/icon', TokenMiddleware, (req, res) => {
    const userId = req.params.userId;

    UserDAO.getUserById(userId).then(user => {
        if (user) {
            if(!user.icon) {
                res.json({message: "No icon for this user"});
            } else {
                const filePath = path.join(__dirname, '..', '..', user.icon);
                res.sendFile(filePath);
            }            
        } else {
            res.status(404).json({ "error": "User not found" });
        }
    })
});

//Retrieve a user's campaigns
// TODO: should we take the userId out of the url?
// seems like it should only be current user
router.get('/users/:userId/campaigns', TokenMiddleware, upload, (req, res) => {
    const userId = req.params.userId;
    CampaignDAO.getCampaignsByUser(userId).then(campaigns => {
        console.log(campaigns);
        res.json(campaigns);
    });
});

// TODO - remove userId from this url
//Join a user to a campaign
router.put('/users/:userId/campaigns', TokenMiddleware, (req, res) => {

    // get campaign join code from request body
    const joinCode = req.body.joinCode;
    const userId = req.params.userId;
    //const campaign = Object.values(campaigns).find(campaign => campaign.joinCode == joinCode);

    CampaignDAO.getCampaignByJoinCode(joinCode).then(campaign => {
        if (!campaign) {
            res.status(404).json({ "error": "Campaign not found" });
            return;
        }
        // ????
        CampaignDAO.joinUserToCampaign(userId, campaign.id).then((result) => {
            res.status(200).json(result);
        }).catch(err => {
            res.status(err.code).json({ error: err.message });
        });
    });
    
    //check if a user is already in a campaign
    // console.log(campaign["userIds"]);
    // if (campaign["userIds"].includes(userId)) {
    //     res.status(400).json({ "error": "You have already joined this campaign." });
    //     return;
    // }

    // add userid to campaign list of userIds
    //(campaigns[campaign.id]).userIds.push(userId);

    // return success or failure response
    
});

// TODO
//create a campaign
router.post('/campaigns', TokenMiddleware, upload, (req, res) => {
    // request body should include name, description, banner
    // id and join code are generated
    // owner is the current auth'd user? but req body for NOW
    // userIds and tags are empty at the start
    const newCampaign = {};
    //newCampaign.id = Math.max(...Object.keys(campaigns)) + 1;
    newCampaign.joinCode = makeJoinCode(5);

    // TODO: see if we can fix the join code maker.
    // right now it just makes a random one and hopes that it isn't already in use

    newCampaign.ownerId = parseInt(req.user.userId);
    console.log("USER ID USED " + req.user.userId);
    newCampaign.name = req.body.name;
    newCampaign.description = req.body.description;
    newCampaign.banner = req.file.path;

    //campaigns[newCampaign.id] = newCampaign;
    CampaignDAO.createCampaign(newCampaign).then(campaign => {
        res.json(newCampaign.joinCode);
    }).catch(err => {
        console.log(err);
        res.status(err.code).json({ error: err.message });
    });

    // return success or failure response
    // res.status(200).json(newCampaign.joinCode);
});

//Retrieve a campaign by id
router.get('/campaigns/:campaignId', TokenMiddleware, (req, res) => {
    const campaignId = req.params.campaignId;
    CampaignDAO.getCampaignById(campaignId).then(campaign => {
        if (campaign) {
            campaign.tags = JSON.parse(campaign.tags);
            campaign.userIds = JSON.parse(campaign.userIds);

            res.json(campaign);
        } else {
            res.status(404).json({ "error": "Campaign not found" });
        }
    })
});

//Retrieve a campaign's banner
router.get('/campaigns/:campaignId/banner', TokenMiddleware, (req, res) => {
    const campaignId = req.params.campaignId;

    CampaignDAO.getCampaignById(campaignId).then(campaign => {
        if (campaign) {
            const filePath = path.join(__dirname, '..', '..', campaign.banner);
            res.sendFile(filePath);
        } else {
            res.status(404).json({ "error": "Campaign not found" });
        }
    })
});

// // TODO: this might need more complex authentication than the others...
// //remove a player from a campaign
// router.delete('/campaigns/:campaignId/users/:userId', TokenMiddleware, (req, res) => {
//     // const campaignId = parseInt(req.params.campaignId);
//     // const campaign = campaigns[campaignId];
//     // if (!campaign) {
//     //     res.status(404).json({ "error": "Campaign not found" });
//     //     return;
//     // }
//     // const userId = parseInt(req.params.userId);
//     // const index = campaign.userIds.indexOf(userId);
//     // if (index == -1) {
//     //     res.status(404).json({ "error": "User not found" });
//     //     return;
//     // }
//     // campaign.userIds.splice(index, 1);

    
//     UserDAO.removeUserFromCampaign(req.params.userId, req.params.campaignId).then(() => {
//         res.status(200).json({ "message": "success" });
//     });

// });

// update cpn description, tags, image
router.put('/campaigns/:campaignId/settings', TokenMiddleware, upload, (req, res) => {
    console.log("campaign settings put received", req.body);
    res.json({"message": "success"});
});

// //update campaign description
// router.patch('/campaigns/:campaignId/description', TokenMiddleware, (req, res) => {
//     const campaignId = parseInt(req.params.campaignId);
//     const campaign = campaigns[campaignId];
//     if (!campaign) {
//         res.status(404).json({ "error": "Campaign not found" });
//         return;
//     }
//     if (req.body.description == undefined || req.body.description == "") {
//         res.status(400).json({ "error": "Invalid description" });
//         return;
//     }
//     campaign.description = req.body.description;
//     res.status(200).json({ "message": "success" });
// });

// //update campaign tags
// router.patch('/campaigns/:campaignId/tags', TokenMiddleware, (req, res) => {
//     const campaignId = parseInt(req.params.campaignId);
//     const campaign = campaigns[campaignId];
//     if (!campaign) {
//         res.status(404).json({ "error": "Campaign not found" });
//         return;
//     }
//     if (req.body.tags == undefined || !Array.isArray(req.body.tags)) {
//         res.status(400).json({ "error": "Invalid tags list" });
//         return;
//     }
//     campaign.tags = req.body.tags;
//     res.status(200).json({ "message": "success" });
// });

// //update banner image
// router.patch('/campaigns/:campaignId/banner', TokenMiddleware, (req, res) => {
//     const campaignId = parseInt(req.params.campaignId);
//     const campaign = campaigns[campaignId];
//     if (!campaign) {
//         res.status(404).json({ "error": "Campaign not found" });
//         return;
//     }
//     if (req.body.banner == undefined || req.body.banner == "") {
//         res.status(400).json({ "error": "Invalid banner image link" });
//         return;
//     }
//     campaign.banner = req.body.banner;
//     res.status(200).json({ "message": "success" });
// });

// //get VIEWABLE notes by campaign
// router.get('/campaigns/:campaignId/notes', TokenMiddleware, (req, res) => {
//     // note - this request will always need to filter out non-viewable notes
//     // based on authentication
//     const userId = req.user.userId;
//     console.log("retrieved userId", userId);
//     const campaignId = req.params.campaignId;

//     NoteDAO.getViewableNotesByCampaign(userId, campaignId).then(notes => {
//         console.log("got", notes);
//         res.json(notes);
//     });

// });

//get SHARED notes by campaign (shitty version)
router.get('/campaigns/:campaignId/notes/shared', TokenMiddleware, (req, res) => {
    // note - this request will always need to filter out non-viewable notes
    // based on authentication
    const userId = req.user.userId;
    console.log("retrieved userId", userId);
    const campaignId = req.params.campaignId;

    NoteDAO.getViewableNotesByCampaign(userId, campaignId).then(notes => {
        console.log("got", notes);
        notes = notes.filter(note => note.sharedWith.includes(userId));
        console.log("filtered", notes);
        res.json(notes);
    });

});

//get VIEWABLE notes by creator and campaign
router.get('/campaigns/:campaignId/notes/users/:userId', TokenMiddleware, (req, res) => {
    // one of many routes that lost a 404 for campaign not found- TODO - talk with
    // group members about whether that is needed

    // note - this request will always need to filter out non-viewable notes
    // based on authentication
    const userId = req.user.userId;
    console.log("retrieved userId", userId);
    const campaignId = req.params.campaignId;
    const authorId = req.params.userId;

    console.log("getting", userId, authorId, campaignId);
    
    NoteDAO.getViewableNotesByAuthorByCampaign(userId, authorId, campaignId).then(notes => {
        console.log("got", notes);
        res.json(notes);
    });
});

//get all tags a user has used in a campaign
router.get('/users/:userId/tags/campaigns/:campaignId', TokenMiddleware, (req, res) => {

});

//create a note
router.post('/campaigns/:campaignId/notes', TokenMiddleware, (req, res) => {
    console.log("post request received");
    //console.log(req.body);
    //console.log(req.user.userId);
    const note = req.body;
    note.ownerId = req.user.userId;
    note.campaignId = req.params.campaignId;
    
    NoteDAO.createNote(note).then(newNote => {
        console.log(newNote);
        res.json(newNote);
    }).catch(err => {
        console.log(err);
        res.status(err.code).json({ error: err.message });
    });
});

// TODO: this may also need more complicated authentication
// maybe pass ownerId as a parameter...? yeah i think that would work
//update a note
router.put('/campaigns/:campaignId/notes/:noteId', TokenMiddleware, (req, res) => {
    console.log("put request received");
    console.log(req.body);
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