import { Form, useParams, useNavigate } from "react-router-dom";
import "./campaignSettings.css";
import api from "../../client/APIClient";
import { useEffect, useState } from "react";
import Tag from "../../components/Tag/Tag";
import PlayerCard from "../../components/PlayerCard/PlayerCard";
import { FaTrash, FaUndo } from "react-icons/fa";

import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


export default function CampaignSettings() {
    //used for tag pop up container 
    const [open, setOpen] = useState(false);

    const [campaign, setCampaign] = useState(null);
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { campaignId }= useParams();
    const navigate = useNavigate();

    useEffect(() => {
        api.getCurrentUser().then(currUser => {
            api.getCampaign(campaignId).then(campaign => {
                setCampaign(campaign);
                if(campaign.ownerId !== currUser.userId) { //user not the GM, they cannot view the settings
                    setError(true);
                }

                if (campaign && !campaign.userIds.includes(null)) {
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
            });
        }).catch(() => { //user not authorized
            navigate("/login");
        });
        
    }, []);

    if(error) {
        return(<h1>Error: You are not authorized to view this page.</h1>);
    }

    const handleDeleteUserClick = (userId) => {
        let updatedSelectedUsers = [];
        if(selectedUsers.includes(userId)) { //user pressed undo
            updatedSelectedUsers = selectedUsers.filter(id => id !== userId);
        } else { //user pressed delete
            updatedSelectedUsers = [...selectedUsers, userId];
        }
        setSelectedUsers(updatedSelectedUsers);
    }

    //used for campaign tag pop up
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    return (
        <>
            <div className="campaign-settings">
                <main>
                    <h1>CAMPAIGN SETTINGS</h1>
                    <div className="settings-box">
                        <Form method="post" action={`/campaigns/${campaignId}/settings`} encType="multipart/form-data">
                            <h1>{campaign && campaign.name}</h1>
                            <h2>Join Code: {campaign && campaign.joinCode}</h2>
                            {/* name description banner */}
                            <input type="hidden" name="campaignId" value={campaignId} />

                            <label htmlFor="description">Description:</label>
                            <textarea name="description" rows="3" defaultValue={campaign && campaign.description} required></textarea>

                            <label htmlFor="banner">Banner:</label>
                            <input type="file" name="img-upload" id="img-upload-input" />
                            
                            {/* Players */}
                            <label htmlFor="players">Players:</label>
                            <div id="players" className="players-container">
                                {players.map(player => (
                                    <div div className="player" key={player.userId}>
                                        <PlayerCard key={player.userId} player={player}/>
                                        {selectedUsers.includes(player.userId) ? 
                                            <FaUndo className="icon" onClick={() => handleDeleteUserClick(player.userId)} /> 
                                            :
                                            <FaTrash className="icon" onClick={() => handleDeleteUserClick(player.userId)} />}
                                    </div>
                                ))}                              
                            </div>


                            {/* Tags */}
                            <Button onClick={handleClickOpen}>Edit Campaign Tags</Button>
                            <Dialog 
                                onClose={handleClose}
                                open={open}
                                PaperProps={{
                                    style: {
                                      backgroundColor: '#c0b5cb'
                                    },
                                    scroll: "paper"
                                  }}>
                                <DialogTitle>
                                    {"Edit Campaign Tags"}
                                </DialogTitle>
                                <DialogContent>
                                <DialogContentText>
                                    {campaign && campaign.tags.map((tag, index) => (
                                        <Tag content={tag} key={index}/>
                                    ))}
                                </DialogContentText>
                                </DialogContent>
                            </Dialog>

                            <label htmlFor="tags">tags:</label>
                            <div id="tags">
                                {campaign && campaign.tags.map((tag, index) => (
                                    <Tag content={tag} key={index}/>
                                ))}
                            </div>

                            <input type="submit" value="Save" />
                            
                        </Form>
                    </div>
                </main>
            </div>
        </>
    );
}