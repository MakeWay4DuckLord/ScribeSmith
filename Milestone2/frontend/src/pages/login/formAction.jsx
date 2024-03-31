import {redirect} from 'react-router-dom';
import api from "../../client/APIClient";

export const loginAction = async ({request}) => {
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");
    
    if( !email || !password) {
        return {error: "Please fill in all required fields."}
    } else {
        try {
            await api.login(email, password);
            return redirect('/my-campaigns');
        } catch(err) {
            console.log(err);
            return {error: err};
        }
    }   
}