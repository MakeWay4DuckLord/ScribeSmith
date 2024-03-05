const API_BASE = '/api';

function checkResponse(res) {
    if(!res.ok) {
      throw new Error("There was an error in fetch");
    }
    return res;
  }

function handleError(error) {
    console.log("ERROR", error);
    throw error;
}

const getUserCampaigns = (userId) => {
    return fetch(API_BASE + `/users/${userId}/campaigns`)
        .then(checkResponse)
        .then(res => {
            return res.json();
        })
        .then(campaigns => {
            return campaigns;
        })
        .catch(handleError);
}

const getCampaign = (campaignId) => {
    return fetch(API_BASE + `/campaigns/${campaignId}`)
        .then(checkResponse)
        .then(res => {
            return res.json();
        })
        .then(campaign => {
            return campaign;
        })
        .catch(handleError);
}

const getUser = (userId) => {
    return fetch(API_BASE + `/users/${userId}`)
        .then(checkResponse)
        .then(res => {
            return res.json();
        })
        .then(user => {
            return user;
        })
        .catch(handleError);
}

const getCampaignNotesByUser = (campaignId, userId) => {
    // /campaigns/:campaignId/notes/users/:userId
    return fetch(API_BASE + `/campaigns/${campaignId}/notes/users/${userId}`)
        .then(checkResponse)
        .then(res => {
            return res.json();
        })
        .then(notes => {
            return notes;
        })
        .catch(handleError);
}

export default {
    getUserCampaigns,
    getCampaign,
    getUser,
    getCampaignNotesByUser,
}
