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
            await api.joinCampaign(1, campaignCode);
            return redirect('/my-campaigns');
        } catch(err) {
            console.log(err);
            return {error: err};
        }
    }   
}