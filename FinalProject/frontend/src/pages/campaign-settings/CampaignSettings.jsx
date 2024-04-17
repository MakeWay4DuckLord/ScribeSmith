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
import TextField from '@mui/material/TextField';

export default function CampaignSettings() {
    //used for tag pop up container 
    const [tagOpen, setTagOpen] = useState(false);

    const [deleteCampaignOpen, setDeleteCampaignOpen] = useState(false);

    const [campaign, setCampaign] = useState(null);
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentTags, setCurrentTags] = useState([]);
    const [tempTagsToDelete, setTempTagsToDelete] = useState([]);
    const [isNewTagOpen, setIsNewTagOpen] = useState(false);
    const [newTag, setNewTag] = useState(null);

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
                        setCurrentTags(campaign.tags.filter(tag => tag !== null));
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

    const handleDeleteTagClick = (tagContent) => {
        let updatedToDeleteTags = []
        if(tempTagsToDelete.includes(tagContent)) { //tag wil be deleted
            updatedToDeleteTags = tempTagsToDelete.filter(tag => tag !== tagContent);
        } else { //undo button is pressed
            updatedToDeleteTags = [...tempTagsToDelete, tagContent];
        }
        setTempTagsToDelete(updatedToDeleteTags);
    }

    const handleNewTagTextChange = (event) => {
        setNewTag(event.target.value);
    }

    const addNewTag = () => {
        if(newTag !== "") {
            const updatedCurrentTags = [...currentTags, newTag];
            setCurrentTags(updatedCurrentTags);
        }
        
        setIsNewTagOpen(false);
    }

    //used for campaign tag pop up
    const handleClickTagOpen = () => {
        setTagOpen(true);
    };

    const handleTagClose = () => {
        setTagOpen(false);

        //delete all of the tags that the user selected
        
        const updatedCurrentTags = currentTags.filter(tag => !tempTagsToDelete.includes(tag));
        setCurrentTags(updatedCurrentTags);
    };

    const handleDeleteCampaignOpen = () => {
        setDeleteCampaignOpen(true);
    }

    const handleDeleteCampaignClose = () => {
        setDeleteCampaignOpen(false);
    }

    const handleDeleteCampaignClick = () => {
        api.deleteCampaign(campaignId).then(() => {
            navigate("/");
        });
    }
    
    return (
        <>
            <div className="campaign-settings">
                <main>
                    <h1 className="title">CAMPAIGN SETTINGS</h1>
                    <div className="settings-box">
                        <Form method="post" action={`/campaigns/${campaignId}/settings`} encType="multipart/form-data">
                            <h1>{campaign && campaign.name}</h1>
                            <h2>Join Code: {campaign && campaign.joinCode}</h2>
                            {/* name description banner */}
                            <input type="hidden" name="campaignId" value={campaignId} />

                            <label htmlFor="description">Description:</label>
                            <textarea name="description" rows="3" defaultValue={campaign && campaign.description} required></textarea>

                            <label htmlFor="banner">Banner:</label>
                            <input type="file" name="image" accept="image/*" id="img-upload-input" />
                            
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
                            <Button className="tagButton" onClick={handleClickTagOpen}>Edit Campaign Tags</Button>
                            <Dialog 
                                onClose={handleTagClose}
                                open={tagOpen}
                                PaperProps={{
                                    style: {
                                      backgroundColor: '#c0b5cb',
                                      textAlign: "center"
                                    },
                                    scroll: "paper"
                                  }}>
                                <DialogTitle>
                                    {"Edit Campaign Tags"}
                                </DialogTitle>
                                <DialogContent>
                                <DialogContentText>
                                    
                                        {campaign && currentTags.map((tag, index) => (
                                            <div className="tagContainer">
                                                <Tag content={tag} key={index}/>
                                                {tempTagsToDelete.includes(tag) ? 
                                                    <FaUndo className="icon" onClick={() => handleDeleteTagClick(tag)} /> 
                                                    :
                                                    <FaTrash className="icon" onClick={() => handleDeleteTagClick(tag)} />
                                                }
                                            </div>  
                                        ))}
                                        <button 
                                            className="addNewTag"
                                            type="button"
                                            onClick={() => setIsNewTagOpen(isNewTagOpen ? false : true)}>
                                                Add New Tag
                                        </button>    
                                        {isNewTagOpen ? 
                                            <div className="newTag">
                                                <TextField id="standard-basic" label="Tag Name" variant="standard" onChange={handleNewTagTextChange} />
                                                <button type="button" onClick={addNewTag}>Add</button>
                                            </div>
                                            :
                                            <></>
                                        }         
                                        
                                </DialogContentText>
                                </DialogContent>
                            </Dialog>

                            <input type="hidden" name="userIdsToRemove" value={JSON.stringify(selectedUsers)} />
                            <input type="hidden" name="tags" value={JSON.stringify(currentTags)} />

                            <input type="submit" value="Save" />

                            {/*Delete Campaign Functionality */}
                            <button type="button" className="deleteButton" onClick={(handleDeleteCampaignOpen)}>Delete Campaign</button>
                            <Dialog 
                                onClose={handleDeleteCampaignClose}
                                open={deleteCampaignOpen}
                                PaperProps={{
                                    style: {
                                      backgroundColor: '#c0b5cb',
                                      textAlign: "center"
                                    },
                                  }}>
                                <DialogTitle>
                                    Are you sure you want to delete {campaign && campaign.name}?
                                </DialogTitle>
                                <DialogContent>
                                <DialogContentText>
                                    <button type="button" className="cancel" onClick={handleDeleteCampaignClose}>No, Cancel</button>
                                    <button type="button" className="confirmDelete"  onClick={handleDeleteCampaignClick}>Yes, Delete Campaign</button>
                                </DialogContentText>
                                </DialogContent>
                            </Dialog>

                            
                        </Form>
                    </div>
                </main>
            </div>
        </>
    );
}