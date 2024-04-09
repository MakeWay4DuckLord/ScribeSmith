import { useParams } from "react-router-dom";
import "./campaignSettings.css";
import api from "../../client/APIClient";
import { useEffect, useState } from "react";
import Tag from "../../components/Tag/Tag";
import PlayerCard from "../../components/PlayerCard/PlayerCard";

export default function CampaignSettings() {
    const [campaign, setCampaign] = useState(null);
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState(null);
    const { campaignId }= useParams();

    useEffect(() => {
        api.getCampaign(campaignId).then(campaign => {
            setCampaign(campaign);

            if (campaign && campaign.userIds.length !== 0) {
                Promise.all( //wait for all the promises from the api calls to resolve
                    campaign.userIds.map(userId => api.getUser(userId))).then(userArr => {
                    setPlayers(userArr);
                }).catch(err => {
                    setError(true);
                });
            }
        })
        .catch(err => {
            setError(true);
        })
    }, [campaignId]);

    return (
        <>
            <div className="campaign-settings">
                <h1>CAMPAIGN SETTINGS</h1>
                <div className="settings-box">
                    <form method="post" encType="multipart/form-data">
                        <h2>{campaign && campaign.name}</h2>
                        {/* name description banner */}
                        
                        <label htmlFor="description">Description:</label>
                        <textarea name="description" rows="5" defaultValue={campaign && campaign.description}required></textarea>

                        <label htmlFor="banner">Banner:</label>
                        <input type="file" name="img-upload" id="img-upload-input" defaultValue={campaign && campaign.banner} required />
                        
                        {/* Players */}
                        <label htmlFor="players">Players:</label>
                        <div id="players" className="players-container">
                            {players.map(player => (
                                <div key={player.userId}>
                                    <PlayerCard key={player.userId} player={player}/>
                                    <input name={player.userId} type="checkbox"/>
                                </div>
                            ))}
                        </div>


                        {/* Tags */}
                        <label htmlFor="tags">tags:</label>
                        <div id="tags">
                            {campaign && campaign.tags.map((tag, index) => (
                                <Tag content={tag} key={index}/>
                            ))}
                        </div>

                        <input type="submit" value="Save" />
                        
                    </form>
                </div>
            </div>
        </>
    );
}