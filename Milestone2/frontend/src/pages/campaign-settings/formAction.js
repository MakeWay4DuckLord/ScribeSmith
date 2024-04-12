import api from "../../client/APIClient";
import {redirect} from 'react-router-dom';

export const campaignSettingsAction = async ({request}) => {
    const data = await request.formData();
    const campaignId = data.get("campaignId")
    try {
        console.log(campaignId);
        await api.updateCampaign(campaignId, data);
        //return redirect('/');
    } catch(err) {
        return {error: err };
    }
}