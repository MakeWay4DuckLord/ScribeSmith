const db = require('./DBConnection');
const Campaign = require('./models/Campaign');

function getCampaignsByUser(userId) {
    // SELECT * FROM campaign JOIN campaign_user ON cpu_cpn_id=cpn_id WHERE cpu_usr_id=1 OR cpn_owner_id=1 GROUP BY cpn_id;
    return db.query('SELECT * FROM campaign JOIN campaign_user ON cpu_cpn_id=cpn_id WHERE cpu_usr_id=? OR cpn_owner_id=? GROUP BY cpn_id', [userId, userId]).then(({results}) => {
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

module.exports = {
    getCampaignsByUser,
    getCampaignById
};