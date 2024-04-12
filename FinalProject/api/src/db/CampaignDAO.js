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
            console.log("AAAAAA: ", results[0]);
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
                getCampaignById(results.insertId).then(campaign => {
                    resolve(campaign);
                });
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