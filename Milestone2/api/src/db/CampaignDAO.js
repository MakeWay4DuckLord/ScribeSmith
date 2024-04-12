const db = require('./DBConnection');
const Campaign = require('./models/Campaign');

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
    c.cpn_id,
    c.cpn_owner_id,
    c.cpn_name,
    c.cpn_banner,
    c.cpn_description,
    c.cpn_join_code,
    JSON_ARRAYAGG(DISTINCT cu.cpu_usr_id) AS cpn_user_ids,
    JSON_ARRAYAGG(DISTINCT t.tag_text) AS cpn_tags
  FROM
    campaign c
  JOIN
    campaign_user cu ON c.cpn_id = cu.cpu_cpn_id
  JOIN
    campaign_tag ct ON c.cpn_id = ct.cpt_cpn_id
  JOIN
    tag t ON ct.cpt_tag_id = t.tag_id
  WHERE
    c.cpn_id = ?;`, [campaignId]).then(({ results }) => {
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
    return db.query('INSERT INTO campaign_user VALUES (?, ?);', [campaignId, userId]).then(() => {
        return {message: "success"};
    }
    );
}

function createCampaign(campaign) {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO campaign (cpn_owner_id, cpn_name, cpn_banner, cpn_description, cpn_join_code) VALUES (?, ?, ?, ?, ?)',
            [campaign.ownerId, campaign.name, campaign.banner, campaign.description, campaign.joinCode]).then(({ results }) => {
                resolve(getCampaignById(results.insertId));
            });
    });
}

module.exports = {
    getCampaignsByUser,
    getTagsByCampaignId,
    getCampaignById,
    getCampaignByJoinCode,
    joinUserToCampaign,
    createCampaign
};