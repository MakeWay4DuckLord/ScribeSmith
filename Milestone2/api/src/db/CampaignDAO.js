const db = require('./DBConnection');
const Campaign = require('./models/Campaign');

function getCampaignsByUser(userId) {
    // SELECT * FROM campaign JOIN campaign_user ON cpu_cpn_id=cpn_id WHERE cpu_usr_id=1 OR cpn_owner_id=1 GROUP BY cpn_id;
    return db.query('SELECT * FROM campaign LEFT JOIN campaign_user ON cpu_cpn_id=cpn_id WHERE cpu_usr_id=? OR cpn_owner_id=? GROUP BY cpn_id', [userId, userId]).then(({results}) => {
        return results.map(campaign => new Campaign(campaign));
    });
}

function getCampaignById(campaignId) {
    return db.query('SELECT * FROM campaign WHERE cpn_id=?', [campaignId]).then(({ results }) => {
        if (results[0]) {
            return new Campaign(results[0]);
        }
    });
}

function createCampaign(campaign) {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO campaign (cpn_owner_id, cpn_name, cpn_banner, cpn_description, cpn_join_code) VALUES (?, ?, ?, ?, ?)',
        [campaign.ownerId, campaign.name, campaign.banner, campaign.description, campaign.joinCode]).then(({results}) => {
           resolve(getCampaignById(results.insertId));
       });
    });
    
}

module.exports = {
    getCampaignsByUser,
    getCampaignById,
    createCampaign
};