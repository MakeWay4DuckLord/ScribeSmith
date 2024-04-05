import {redirect} from 'react-router-dom';
import api from "../../client/APIClient";

export const userSettingsAction = async ({request}) => {
    const data = await request.formData();
    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const image = data.get("image");

    if(lastName.trim().length === 0 || firstName.trim().length === 0) { //name cannot be empty
        return {error: "Please fill out first and last name fields" };
    }

    try {

        const currentUser = await api.getCurrentUser();
        await api.updateUser(currentUser.userId, data);
        
        return redirect('/');    
        
    } catch(err) {
        return {error: err };
    }
}