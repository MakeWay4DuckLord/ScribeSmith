import api from "../../client/APIClient";

export const createCampaignAction = async ({request}) => {
    const data = await request.formData();
    
    try {
        const currentUser = await api.getCurrentUser();
        data.append('ownerId', currentUser.userId);
        const joinCode = await api.createCampaign(data);
        console.log(joinCode);
        return {joinCode: joinCode};
        
    } catch(err) {
        return {error: err };
    }
}