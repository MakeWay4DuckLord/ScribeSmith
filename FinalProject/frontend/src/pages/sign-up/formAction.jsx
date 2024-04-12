import {redirect} from 'react-router-dom';
import api from "../../client/APIClient";

export const signUpAction = async ({request}) => {
    const data = await request.formData();
    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const email = data.get("email");
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");
    
    if( !firstName || !lastName || !email || !password) {
        return {error: "Please fill in all required fields."}
    }
    else if(password !== confirmPassword) {
        return {error: "Passwords do not match."};
    } else {
        try {
            await api.signUp(firstName, lastName, email, password);
            return redirect('/');
        } catch(err) {
            console.log("HI");
            console.log(err);
            return {error: err};
        }
    }   
}