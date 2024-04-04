import { Form, useActionData } from "react-router-dom";
import api from "../../client/APIClient";
import { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import "./userSettings.css"

export default function UserSettings() {
    const [currentUser, setCurrentUser] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const data = useActionData();

    useEffect(() => {
        api.getCurrentUser().then((user) => {
            setCurrentUser(user);
            setSelectedFile(user.icon);
            setFirstName(user.firstName);
            setLastName(user.lastName);
        }).catch(() => { //not authorized
            console.log("ERR");
        })
    }, []);

    const handleFileChange = (e) => {
        const imageUrl = URL.createObjectURL(e.target.files[0]);
        setSelectedFile(imageUrl);
    }

    const handleResetClick = () => {
        setSelectedFile(currentUser.icon);
    }

    return (
        <div className="user-settings-page">
            <h1>USER SETTINGS</h1>
            <main>                
                <Form className="form" method="post" action="/user-settings">
                    <h3>Change Name:</h3>
                    <div className="name-inputs">
                        <label htmlFor="firstName">First Name</label>
                            <input type="text" name="firstName" placeholder="First Name" defaultValue={firstName} maxLength={50} required/>

                            <label htmlFor="lastName">First Name</label>
                            <input type="text" name="lastName" placeholder="Last Name" defaultValue={lastName} maxLength={50} required/>
                    </div>
                    
                     
                    <h3>Change Profile Image:</h3>
                    <div className="icon-container">
                        <Avatar 
                            src={selectedFile} 
                            alt="Profile image"
                            sx={{ width: 56, height: 56 }} />
                        <input type="file" onChange={handleFileChange} accept="image/*" name="image" />
                    </div>
                    
                    <button type="button" onClick={handleResetClick}>Reset Profile Image</button>
                    {data && data.error && <p className="error">{data.error}</p>}
                    <input type="submit" value="SAVE SETTINGS" />
                </Form>
            </main>
        </div>
    );
}