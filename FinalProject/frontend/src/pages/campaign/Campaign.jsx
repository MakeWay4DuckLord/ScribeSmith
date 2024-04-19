import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../client/APIClient"
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdSupervisedUserCircle } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import './campaign.css';


//TODO: Only show settings if the user who is logged in is the owener of the campaign
export default function Campaign() {
    const [campaign, setCampaign] = useState({});
    const [isGM, setIsGM] = useState(false);
    const [banner, setBanner] = useState(null);
    const [owner, setOwner] = useState("");
    const [error, setError] = useState("");
    const { campaignId } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        api.getCurrentUser().then(currentUser => { //get the current user
            api.getCampaign(campaignId).then(campaign => {
                console.log(campaign);
                if(campaign.userIds && campaign.userIds.includes(currentUser.userId) || campaign.ownerId === currentUser.userId) { //check if current user is authorized
                    setCampaign(campaign);
    
                    if (campaign.ownerId !== undefined) {
                        api.getUser(campaign.ownerId).then(user => {
                            setOwner(`${user.first_name} ${user.last_name}`);

                            if(currentUser.userId === campaign.ownerId) {
                                setIsGM(true);
                            }
                        });
                    }

                    api.getCampaignBanner(campaignId).then(banner => {
                        setBanner(banner);
                    });
                } else {
                    setError("You are not authorized to view this campaign.");
                }
                
            })
            .catch(err => {
                console.log(err);
                setError("Error loading campaign data");
            })
            
        }).catch(() => { //not authenticated
            navigate("/login");
        })
        
    }, [campaignId]);

    if(error !== "") {
        return <h2>{error}</h2>
    }

    return (
        <div className="campaign-page">
            <main>
                <div>
                    <img className="banner" src={banner} alt="campaign banner" />
                    <h2>{campaign.name}</h2>
                    <span>GM: <p className="owner">{owner}</p></span>
                </div>

                <div>
                    <Link className="nav-container" to={`/campaigns/${campaign.id}/my-notes`}>
                        <FaUserCircle className="icon" />
                        <h3>My Notes</h3>
                    </Link>

                    <Link to={`/campaigns/${campaign.id}/shared-notes`} className="nav-container"> 
                        <MdSupervisedUserCircle className="icon" />
                        <h3>Shared Notes</h3>
                    </Link>

                    {(isGM) ? 
                        <Link to={`/campaigns/${campaign.id}/settings`} className="nav-container">
                        <IoMdSettings  className="icon" />
                        <h3>Settings</h3>
                        </Link>
                        :
                        <></>
                    }
                    

                    
                </div>
            </main>
        </div>
    );

    
}