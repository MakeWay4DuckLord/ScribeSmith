const API_BASE = '/api';
function checkResponse(res) {
    if(!res.ok) {
        return res.json().then(error => {
            throw error.error;
        })
    }
    return res;
  }

function handleError(error) {
    console.log("ERROR", error);
    throw error;
}

const signUp = (firstName, lastName, email, password) => {
    return fetch(API_BASE + `/users/`, {
        method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        })
    })
    .then(checkResponse)
    .then(res => {
        return res.json();
    })
    .catch(handleError)
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

const joinCampaign = (userId, joinCode) => {
    return fetch(API_BASE + `/users/${userId}/campaigns`, {
            method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId: userId,
                              joinCode: joinCode})
    })
    .then(checkResponse)
    .then(res => {
        return res.json();
    })
    .catch(handleError);
}

export default {
    signUp,
    getUserCampaigns,
    getCampaign,
    getUser,
    getCampaignNotesByUser,
    joinCampaign,
}
