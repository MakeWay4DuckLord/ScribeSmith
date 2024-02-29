import { Link } from "react-router-dom";
import CampaignCard from "../../components/CampaignCard/CampaignCard";
import "./campaign.css"

export default function Campaigns() {
    return (
        <>
            <div className="campaign-page">
                <div className="content">
                    <div className="buttons">
                        <Link to="/join-campaign"><button>Join Campaign</button></Link>
                        <Link><button to="/create-campaign">Create Campaign</button></Link>
                    </div>

                    <h1>MY CAMPAIGNS</h1>

                    <div className="campaign-container">
                        <CampaignCard name="Campaign Name" owner="User 1" description="description" />
                        <CampaignCard name="Campaign Name" owner="User 1" description="description" />
                        <CampaignCard name="Campaign Name" owner="User 1" description="description" />
                        <CampaignCard name="Campaign Name" owner="User 1" description="description" />
                    </div>
                    
                </div>                
            </div>            
        </>
    );
}