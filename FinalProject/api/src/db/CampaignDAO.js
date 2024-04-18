const db = require('./DBConnection');
const Campaign = require('./models/Campaign');

// copied over from NoteDAO
getOrInsertTagId = (tagText) => {
    //console.log("trying to process tag", tagText);
    return new Promise((resolve, reject) => {
        db.query('SELECT tag_id FROM tag WHERE tag_text = ?', [tagText]).then(({ results }) => {
            if (results.length > 0) {
                //console.log("tag id found", results[0].tag_id);
                resolve(results[0].tag_id);
            } else {
                db.query('INSERT INTO tag (tag_text) VALUES (?)', [tagText]).then(({ results }) => {
                    //console.log("inserting tag");
                    resolve(results.insertId); // Return the id of the newly inserted tag
                });
            }
        })
    });
};

addCampaignTags = (campaign, tagIds) => {
    console.log("adding tags to campaign");
    const valuePairs = tagIds.map(tagId => [campaign.id, tagId]);
    console.log("inserting", valuePairs);
    return db.query('INSERT INTO campaign_tag (cpt_cpn_id, cpt_tag_id) VALUES ?;', [valuePairs]).then(({ results }) => {
        // TODO: err checking here
        console.log("campaign tags added");
        return campaign;
    }).catch((err) => {
        // reject({ code: 500, message: err });
        console.log("AAAA", err);
    });
};

function getCampaignsByUser(userId) {
    // SELECT * FROM campaign JOIN campaign_user ON cpu_cpn_id=cpn_id WHERE cpu_usr_id=1 OR cpn_owner_id=1 GROUP BY cpn_id;
    return db.query('SELECT * FROM campaign LEFT JOIN campaign_user ON cpu_cpn_id=cpn_id WHERE cpu_usr_id=? OR cpn_owner_id=? GROUP BY cpn_id', [userId, userId]).then(({ results }) => {
        return results.map(campaign => new Campaign(campaign));
    });
}

function getTagsByCampaignId(campaignId) {
    return db.query('SELECT * FROM campaign_tag JOIN tag ON cpt_tag_id=tag_id WHERE cpt_cpn_id=?;', [campaignId]).then(({ results }) => {
        return results.map(tag => new Tag(tag));
    })
}

// TODO - please fix
function getCampaignById(campaignId) {
    return db.query(`SELECT
        c.cpn_id AS cpn_id,
        c.cpn_owner_id AS cpn_owner_id,
        c.cpn_name AS cpn_name,
        c.cpn_banner as cpn_banner,
        c.cpn_description as cpn_description,
        c.cpn_join_code as cpn_join_code,
        COALESCE(JSON_ARRAYAGG(DISTINCT t.tag_text), JSON_ARRAY()) AS cpn_tags,
        COALESCE(JSON_ARRAYAGG(DISTINCT cu.cpu_usr_id), JSON_ARRAY()) AS cpn_user_ids
    FROM
        campaign c
    LEFT JOIN
        campaign_tag ct ON c.cpn_id = ct.cpt_cpn_id
    LEFT JOIN
        tag t ON ct.cpt_tag_id = t.tag_id
    LEFT JOIN
        campaign_user cu ON c.cpn_id = cu.cpu_cpn_id
    LEFT JOIN
        user u ON cu.cpu_usr_id = u.usr_id
    WHERE
    c.cpn_id = ?;`, [campaignId]).then(({ results }) => {
        console.log(results);
        if (results[0]) {
            return new Campaign(results[0]);
        }
    });
}

// internal use ONLY - does not populate tags and users (yet)
function getCampaignByJoinCode(joinCode) {
    return db.query('SELECT * FROM campaign WHERE cpn_join_code=?;', [joinCode]).then(({ results }) => {
        if (results[0]) {
            return new Campaign(results[0]);
        }
    });
}

function joinUserToCampaign(userId, campaignId) {
    // DO WE NEED TO STOP DMS FROM JOINING THEIR OWN CAMPAIGNS???
    // not doing that rn because difficult... but like.. TODO
    return new Promise((resolve, reject) => {

        db.query('SELECT * FROM campaign WHERE cpn_id=?;', [campaignId]).then((result) => {
            if (result.results.length == 0) {
                reject({ code: 404, message: "Campaign not found." });
            } else if (result.results[0].cpn_owner_id == userId) {
                reject({ code: 400, message: "You are the owner of this campaign." });
            }
        }).then(() => {
            db.query('INSERT INTO campaign_user VALUES (?, ?);', [campaignId, userId]).then(() => {
                resolve({ message: "success" });
            }).catch(err => {
                if (err.code == 'ER_DUP_ENTRY') {
                    reject({ code: 400, message: "You have already joined this campaign." });
                } else {
                    reject({ code: err.code, message: err.message });
                }
            });
        });
    });
}

function createCampaign(campaign) {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO campaign (cpn_owner_id, cpn_name, cpn_banner, cpn_description, cpn_join_code) VALUES (?, ?, ?, ?, ?)',
            [campaign.ownerId, campaign.name, campaign.banner, campaign.description, campaign.joinCode]).then(({ results }) => {
                getCampaignById(results.insertId).then(campaign => {
                    resolve(campaign);
                });
            }).catch(err => {
                if (err.code == 'ER_DUP_ENTRY') {
                    reject({ code: 400, message: "Join code already in use. Please try again." });
                } else {
                    reject({ code: err.code, message: err.message });
                }
            });
    });
}

function updateCampaign(campaign, userId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM campaign WHERE cpn_id=?;', [campaign.id]).then((result) => {
            if (result.results.length == 0) {
                reject({ code: 404, message: "Campaign not found." });
            } else if (result.results[0].cpn_owner_id != userId) {
                reject({ code: 401, message: "You are not authorized to edit this campaign." });
            } else {
                //return new Campaign(results[0])
                return campaign;
            }
        }).then((campaign) => {
            console.log("editing time, banner is", campaign.banner);
            if (campaign.banner != null) {
                console.log("we have a banner");
                return db.query(`UPDATE campaign
                SET cpn_description=?, cpn_banner=?
                WHERE cpn_id=?;`, [campaign.description, campaign.banner, campaign.id]).then(() => {
                    return campaign;
                });
            } else {
                console.log("bannerless");
                return db.query(`UPDATE campaign
                SET cpn_description=? WHERE cpn_id=?;`, [campaign.description, campaign.id]).then(() => {
                    return campaign;
                });
            }
        }).then((campaign) => {
            return db.query('DELETE FROM campaign_tag WHERE cpt_cpn_id=?;', [campaign.id]).then(({ results }) => {
                return campaign;
            });
        }).then((campaign) => {
            if (campaign.tags.length > 0) {
                // need to promise.all to make sure all tags are in the tags table
                const tagPromises = [];

                // for each tag
                campaign.tags.forEach(tag => {
                    // this array will resolve to an array of TAG IDs
                    tagPromises.push(getOrInsertTagId(tag));
                });

                return Promise.all(tagPromises).then(tagIds => {
                    console.log("tag promises resolved, tag ids", tagIds);
                    return addCampaignTags(campaign, tagIds).then(() => {
                        return campaign; // ????
                    });
                });
            } else {
                return campaign;
            }
        }).then((campaign) => {
            console.log("deleting users from", campaign);
            if (campaign.userIdsToRemove && campaign.userIdsToRemove.length > 0) {
                console.log("querying!");
                return db.query('DELETE FROM campaign_user WHERE cpu_usr_id IN (?);', [campaign.userIdsToRemove]).then(({ results }) => {
                    console.log("query complete");
                    return campaign;
                }).catch(err => {
                    console.log(err);
                });
            } else {
                return campaign;
            }
        }).then((campaign) => {
            resolve(campaign);
        }).catch((err) => {
            reject({ code: 500, message: err });
        });
    });
}

function deleteCampaign(campaignId, userId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM campaign WHERE cpn_id=?;', [campaignId]).then((result) => {
            if (result.results.length == 0) {
                reject({ code: 404, message: "Note not found." });
            } else if (result.results[0].cpn_owner_id != userId) {
                reject({ code: 401, message: "You are not authorized to delete this campaign." });
            } else {
                return campaignId;
            }
        }).then((campaignId) => {
            return db.query('DELETE note_tag FROM note_tag JOIN note ON ntg_note_id=note_id WHERE note_campaign_id=?;', [campaignId]).then(() => {
                return campaignId;
            }).catch((err) => {
                reject({ code: 500, message: err });
            });
        }).then((campaignId) => {
            return db.query('DELETE note_user FROM note_user JOIN note ON ntu_note_id=note_id WHERE note_campaign_id=?;', [campaignId]).then(() => {
                return campaignId;
            }).catch((err) => {
                reject({ code: 500, message: err });
            });
        }).then((campaignId) => {
            return db.query('DELETE FROM note WHERE note_campaign_id=?;', [campaignId]).then(() => {
                return campaignId;
            }).catch((err) => {
                reject({ code: 500, message: err });
            });
        }).then((campaignId) => {
            return db.query('DELETE FROM campaign_user WHERE cpu_cpn_id=?;', [campaignId]).then(() => {
                return campaignId;
            }).catch((err) => {
                reject({ code: 500, message: err });
            });
        }).then((campaignId) => {
            return db.query('DELETE FROM campaign_tag WHERE cpt_cpn_id=?;', [campaignId]).then(() => {
                return campaignId;
            }).catch((err) => {
                reject({ code: 500, message: err });
            });
        }).then((campaignId) => {
            return db.query('DELETE FROM campaign WHERE cpn_id=?;', [campaignId]).then(() => {
                return campaignId;
            }).catch((err) => {
                reject({ code: 500, message: err });
            });
        }).then((campaignId) => {
            resolve(campaignId);
        })
    });

}

module.exports = {
    getCampaignsByUser,
    getTagsByCampaignId,
    getCampaignById,
    getCampaignByJoinCode,
    joinUserToCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign
};