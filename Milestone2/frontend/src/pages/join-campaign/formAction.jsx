import {redirect} from 'react-router-dom';
import api from "../../client/APIClient";

export const joinCampaignAction = async ({request}) => {
    const data = await request.formData();
    const campaignCode = data.get("code");
    console.log(campaignCode);

    if(!campaignCode || campaignCode.length != 5) {
        return {error: "Campaign code must be 5 characters long."};
    } else {
        try {
            const currentUser = await api.getCurrentUser();
            await api.joinCampaign(currentUser.userId, campaignCode);
            return redirect('/');
        } catch(err) {
            //TODO: Check if error is 401, if so redirect to login page
            //APIClient needs to be changed so error codes are returned so we can do this
            console.log(err);
            return {error: err};
        }
    }   
}