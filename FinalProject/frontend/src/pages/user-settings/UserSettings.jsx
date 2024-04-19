import { Form, useActionData, useNavigate } from "react-router-dom";
import api from "../../client/APIClient";
import { useEffect, useState, useRef } from "react";
import Avatar from '@mui/material/Avatar';
import { FaTrash, FaUndo } from "react-icons/fa";
import "./userSettings.css"

export default function UserSettings() {
    const [currentUser, setCurrentUser] = useState({});
    const [userCampaigns, setUserCampaigns] = useState([]);
    const [selectedCampaigns, setSelectedCampaigns] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const data = useActionData();
    const navigate = useNavigate();

    useEffect(() => {
        api.getCurrentUser().then((user) => {
            setCurrentUser(user);
            setSelectedFile(user.icon);
            setFirstName(user.firstName);
            setLastName(user.lastName);
            
            api.getUserCampaigns(user.userId).then(campaigns => {
                let joinedCampaigns = [];
                campaigns.forEach(campaign => {
                    if(campaign.ownerId != user.userId) { //dont include campaigns a user is owner of, this is deleted under campaign settings
                        joinedCampaigns.push(campaign);
                    }
                })
                setUserCampaigns(joinedCampaigns);
            }).catch((err) => {
                setError(true);
                console.log(err);
            })
        }).catch(() => {  //not authenticated
            navigate("/login");
        })
    }, []);

    if(error === true) {
        return <h1>Error loading user settings.</h1>
    }

    const handleFileChange = (e) => {
        const imageUrl = URL.createObjectURL(e.target.files[0]);
        setSelectedFile(imageUrl);
    }

    const handleResetClick = () => {
        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input value
        }
    }

    const handleDeleteCampaignClick = (campaignId) => {
        let updatedSelectedCampaigns = [];
        if(selectedCampaigns.includes(campaignId)) { //user pressed undo
            updatedSelectedCampaigns = selectedCampaigns.filter(id => id !== campaignId);
        } else { //user pressed delete
            updatedSelectedCampaigns = [...selectedCampaigns, campaignId];
        }
        setSelectedCampaigns(updatedSelectedCampaigns);
    }

    return (
        <div className="user-settings-page">
            <div className="container">
                <h1>USER SETTINGS</h1>
                <main>                
                    <Form className="form" method="post" action="/user-settings" encType="multipart/form-data">
                        <h3>Change Name:</h3>
                        <div className="name-inputs">
                            <label htmlFor="firstName">First Name</label>
                                <input type="text" name="firstName" placeholder="First Name" defaultValue={firstName} maxLength={50} required/>

                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" name="lastName" placeholder="Last Name" defaultValue={lastName} maxLength={50} required/>
                        </div>
                        
                        
                        <h3>Change Profile Image:</h3>
                        <div className="icon-container">
                            <Avatar 
                                src={selectedFile} 
                                alt="Profile image"
                                sx={{ width: 56, height: 56 }} />
                            <input type="file" onChange={handleFileChange} accept="image/*" name="image" ref={fileInputRef} />
                        </div>                        
                        <button type="button" className="reset" onClick={handleResetClick}>Reset Profile Image</button>

                        <h3>Leave Campaigns</h3>
                        {userCampaigns.map(campaign => (
                            <div className="campaign" key={campaign.id}>
                                <p>{campaign.name}</p>
                                {selectedCampaigns.includes(campaign.id) ? 
                                <FaUndo className="icon" onClick={() => handleDeleteCampaignClick(campaign.id)} /> 
                                :
                                <FaTrash className="icon" onClick={() => handleDeleteCampaignClick(campaign.id)} />}
                                
                            </div>
                        ))}
                        <input type="hidden" name="selectedCampaigns" value={JSON.stringify(selectedCampaigns)} />


                        {data && data.error && <p className="error">{data.error}</p>}
                        <input type="submit" value="SAVE SETTINGS" />
                    </Form>
                </main>
            </div>
        </div>
    );
}