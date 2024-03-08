import { useParams } from "react-router-dom";
import "./campaignSettings.css";
import api from "../../client/APIClient";
import { useEffect, useState } from "react";

export default function CampaignSettings() {
    const [campaign, setCampaign] = useState(null);
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState(null);
    const { id }= useParams();

    useEffect(() => {
        api.getCampaign(id).then(campaign => {
            setCampaign(campaign);
            console.log(campaign);

            if (campaign && campaign.userIds.length !== 0) {
                Promise.all( //wait for all the promises from the api calls to resolve
                    campaign.userIds.map(userId =>
                      api.getUser(userId).then(user => ({
                        id: userId,
                        name: user.name,
                        pfp: user.icon
                      }))
                    )
                  ).then(userNamesArr => {
                    setPlayers(userNamesArr);
                }).catch(err => {
                    setError(true);
                });
            }
        })
        .catch(err => {
            setError(true);
        })
    }, [id]);

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
                        <input type="file" name="img-upload" id="img-upload-input" required />
                        
                        {/* Players */}
                        <label htmlFor="players">Players:</label>
                        <div id="players">
                            {/* <p>{JSON.stringify(campaign.userIds[0])}</p> */} 
                            {players.map(player => (
                                <div key={player.id}>
                                    <img src={player.pfp} alt={`profile picture for ${player.name}`}></img>
                                    <p key={player.id}>{`name: ${player.name} id: ${player.id}`}</p>
                                </div>
                            ))}
                        </div>


                        {/* Tags */}

                        {/* <button type="submit">Send</button> */}
                        <input type="submit" value="Save" />
                        
                    </form>
                </div>
            </div>
        </>
    );
}