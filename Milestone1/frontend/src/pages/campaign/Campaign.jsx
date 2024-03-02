import { useParams } from "react-router-dom";
import api from "../../client/APIClient"
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdSupervisedUserCircle } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import './campaign.css';


//TODO: Only show settings if the user who is logged in is the owener of the campaign
export default function Campaign() {
    const [campaign, setCampaign] = useState({});
    const [owner, setOwner] = useState("");
    const [error, setError] = useState(null);
    const { id } = useParams();

    
    useEffect(() => {
        api.getCampaign(id).then(campaign => {
            setCampaign(campaign);

            if (campaign.ownerId !== undefined) {
                api.getUser(campaign.ownerId).then(user => {
                    setOwner(user.name);
                });
            }
        })
        .catch(err => {
            setError(true);
        })
    }, [id]);

    if(error === true) {
        return <h2>Error loading campaign data</h2>
    }

    return (
        <div className="campaign-page">
            <main>
                <div>
                    <img className="banner" src={campaign.banner} alt="campaign banner" />
                    <h2>{campaign.name}</h2>
                    <span>GM: <p className="owner">{owner}</p></span>
                </div>

                <div>
                    <div className="nav-container">
                        <FaUserCircle className="icon" />
                        <h3>My Notes</h3>
                    </div>

                    <div className="nav-container">
                        <MdSupervisedUserCircle className="icon" />
                        <h3>Shared Notes</h3>

                    </div>

                    <div className="nav-container">
                        <IoMdSettings  className="icon" />
                        <h3>Settings</h3>

                    </div>
                </div>
            </main>
        </div>
    );

    
}