const API_BASE = '/api';
function checkResponse(res) {
    if (!res.ok) {
        return res.json().then(error => {
            console.log("ERROR");
            throw error.error;
        })
    }
    return res;
}

function handleError(error) {
    if(typeof error === TypeError && error.message === "Failed to fetch") {
        window.location.href = "/offline";
        return;
    }
    throw error;
}

function checkOffline(res) {
    if(res.isOffline) {
        window.location.href = "/offline";
        return;
    } else {
        return res;
    }
}

const login = (email, password) => {
    return fetch(API_BASE + `/authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                email: email,
                password: password
            })
    })
        .then(checkResponse)
        .then(res => {
            return res.json();
        })
        .then(checkOffline)
        .then(res => {
            return res;
        })
        .catch(handleError)
}

const logout = () => {
    return fetch(API_BASE + `/users/logout`, {
        method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    })
    .then(checkResponse)
    .then(res => {
        return res.json();
    })
    .then(checkOffline)
        .then(res => {
            return res;
    })
    .catch(handleError)
}

const signUp = (firstName, lastName, email, password) => {
    return fetch(API_BASE + `/users`, {
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
    .then(checkOffline)
    .then(res => {
        return res;
    })
    .catch(handleError)
}

const getCurrentUser = () => {

    return fetch(API_BASE + '/users/current')
        .then(checkResponse)
        .then(res => {
            return res.json();
        })
        .then(checkOffline)
        .then(res => {
            return res;
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
        .then(checkOffline)
        .then(res => {
            return res;
        })
        .catch(handleError);
}

const createCampaign = (formData) => {
    return fetch(API_BASE + `/campaigns`, {
        method: 'POST',
        body: formData
    })
        .then(checkResponse)
        .then(res => {
            return res.json();
        })
        .then(checkOffline)
        .then(res => {
            return res;
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
        .then(checkOffline)
        .then(res => {
            return res;
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
        .then(checkOffline)
        .then(res => {
            return res;
        })
        .catch(handleError);
}

const getUserIcon = (userId) => {
    return fetch(API_BASE + `/users/${userId}/icon`)
        .then(checkResponse)
        .then(res => {
            if(null) { 
                return null
            } else {
                return res.blob();
            }
            
        }).then(blob => {
            const imageURL = URL.createObjectURL(blob);
            return imageURL;
        })
        .catch(handleError);
}

const updateUser = (userId, formData) => {
    return fetch(API_BASE + `/users/${userId}`, {
        method: 'PUT',
        body: formData
    })
        .then(checkResponse)
        .then(res => {
            return res.json();
        })
        .then(checkOffline)
        .then(res => {
            return res;
        })
        .catch(handleError);
}

const getCampaignSharedNotes = (campaignId) => {
    return fetch(API_BASE + `/campaigns/${campaignId}/notes/shared`)
        .then(checkResponse)
        .then(res => {
            return res.json();
        })
        .then(notes => {
            return notes;
        })
        .then(checkOffline)
        .then(res => {
            return res;
        })
        .catch(handleError);
}

const getCampaignNotesByUser = (campaignId, userId) => {
    return fetch(API_BASE + `/campaigns/${campaignId}/notes/users/${userId}`)
        .then(checkResponse)
        .then(res => {
            return res.json();
        })
        .then(notes => {
            return notes;
        })
        .then(checkOffline)
        .then(res => {
            return res;
        })
        .catch(handleError);
}

const joinCampaign = (userId, joinCode) => {
    return fetch(API_BASE + `/users/${userId}/campaigns`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId,
            joinCode: joinCode
        })
    })
        .then(checkResponse)
        .then(res => {
            return res.json();
        })
        .then(checkOffline)
        .then(res => {
            return res;
        })
        .catch(handleError);
}

const getCampaignBanner = (campaignId) => {
    return fetch(API_BASE + `/campaigns/${campaignId}/banner`)
        .then(checkResponse)
        .then(res => {
            return res.blob();
        }).then(blob => {
            const imageURL = URL.createObjectURL(blob);
            return imageURL;
        })
        .catch(handleError);
}

const createNote = (campaignId, title, content, tags, sharedWith) => {
    return fetch(API_BASE + `/campaigns/${campaignId}/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            content: content,
            tags: tags,
            sharedWith: sharedWith
        })
    })
        .then(checkResponse)
        .then(res => {
            return res.json();
        })
        .then(checkOffline)
        .then(res => {
            return res;
        })
        .catch(handleError);
}

const updateNote = (noteId, campaignId, title, content, tags, sharedWith) => {
    return fetch(API_BASE + `/campaigns/${campaignId}/notes/${noteId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            content: content,
            tags: tags,
            sharedWith: sharedWith
        })
    })
        .then(checkResponse)
        .then(res => {
            return res.json();
        })
        .then(checkOffline)
        .then(res => {
            return res;
        })
        .catch(handleError);
}

const updateCampaign = (campaignId, formData) => {
    return fetch(API_BASE + `/campaigns/${campaignId}/settings`, {
        method: 'PUT',
        body: formData
        })
        .then(checkResponse)
        .then(res => {
            return res.json();
        })
        .then(checkOffline)
        .then(res => {
            return res;
        })
        .catch(handleError);
}

const deleteCampaign = (campaignId) => {
    return fetch(API_BASE + `/campaigns/${campaignId}`, {
        method: 'DELETE'
        })
        .then(checkResponse)
        .then(res => {
            return res.json();
        })
        .catch(handleError);
}

export default {
    login,
    signUp,
    updateUser,
    logout,
    getCurrentUser,
    getUserIcon,
    getUserCampaigns,
    createCampaign,
    getCampaign,
    getUser,
    getCampaignSharedNotes,
    getCampaignNotesByUser,
    joinCampaign,
    getCampaignBanner,
    createNote,
    updateNote,
    updateCampaign,
    deleteCampaign
}
