import { Link } from "react-router-dom";
import CampaignCard from "../../components/CampaignCard/CampaignCard";
import "./campaigns.css";
import api from "../../client/APIClient";
import { useEffect, useState } from "react";

export default function Campaigns() {
    const [userCampaigns, setUserCampaigns] = useState([]);
    const [ownerNames, setOwnerNames] = useState({});

    //TODO: Change  getUserCampaigns() for the param to be the current user logged in
    useEffect(() => {
        api.getUserCampaigns(1).then(campaigns => {
            setUserCampaigns(campaigns);

            if (campaigns.length !== 0) {
                Promise.all(
                    campaigns.map(campaign =>
                      api.getUser(campaign.ownerId).then(user => ({
                        ownerId: campaign.ownerId,
                        ownerName: user.name
                      }))
                    )
                  ).then(ownerNamesArr => {
                    let newOwnerNames = {};
                    ownerNamesArr.forEach(owner => {
                        newOwnerNames[owner.ownerId] = owner.ownerName;
                    });
                    setOwnerNames(newOwnerNames);
                });
            }
        });
    }, []);

    return (
        <>
            <div className="campaigns-page">
                <div className="content">
                    <div className="buttons">
                        <Link to="/join-campaign"><button>Join Campaign</button></Link>
                        <Link><button to="/create-campaign">Create Campaign</button></Link>
                    </div>

                    <h1>MY CAMPAIGNS</h1>

                    <div className="campaign-container">
                        {userCampaigns.map(campaign => (
                            <Link to={`/campaign/${campaign.id}`} key={campaign.id}>
                                <CampaignCard name={campaign.name} owner={ownerNames[campaign.ownerId]} description={campaign.description} />
                            </Link>
                        ))}
                    </div>
                    
                </div>                
            </div>            
        </>
    );
}