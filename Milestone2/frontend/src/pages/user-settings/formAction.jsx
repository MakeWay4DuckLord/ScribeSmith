import {redirect} from 'react-router-dom';
import api from "../../client/APIClient";

export const userSettingsAction = async ({request}) => {
    const data = await request.formData();
    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const image = data.get("image");
    let imageURL = "";

    if(lastName.trim().length === 0 || firstName.trim().length === 0) { //name cannot be empty
        return {error: "Please fill out first and last name fields" };
    }

   

    try {
        api.getCurrentUser().then(currUser => {
            if(!image) { //user didn't change their profile image
                imageURL = currUser.icon;
            } else { //user uploaded their own profile image
                //upload profile image and get a url to send to db
            }
        })
        
        //update user info
        return redirect('/');
    } catch(err) {

    }
}