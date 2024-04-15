import Tag from "../Tag/Tag";
import TextEditor from "../TextEditor/TextEditor";
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Container from '@mui/material/Container';
import {
    Card,CardContent, CardActions, Container, 
    Button, ButtonGroup, Backdrop, 
    List, ListItemButton, ListItem, ListItemAvatar, ListItemText, ListItemIcon, Avatar, 
    Checkbox, TextField, Divider, Typography,
} from '@mui/material';
import { FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../client/APIClient";


//save function to pass to TextEditor
function save(formData) {
    //TODO implement this for realsies
    console.log("form data:", formData);
    return formData;

    //validate note

    //get add title, tags, and any other data in Note thats not in the TextEditor

    //put or post it depending if its new
}

function onSubmit(e) {
    e.preventDefault();
    console.log('preventing default');
}
//{title: "New Note", content: "", tags: [], id:-1, campaignId:-1, sharedWith: []}
export default function Note({note}) {
    const[openNote, setOpenNote] = useState(note);
    const[isOwner, setIsOwner] = useState(false);
    const[tryAgain, setTryAgain] = useState(false);
    const {campaignId} = useParams();

    const[title, setTitle] = useState("New Note");
    const[newTitle, setNewTitle] = useState("");
    
    const[modified, setModified] = useState(false);
    const[isNew, setIsNew] = useState(true);
    
    const[sharedWith, setSharedWith] = useState([]);
    const[users, setUsers] = useState([]);
    
    const[editor, setEditor] = useState(null);
    const navigate = useNavigate();
    
    const[shareOpen, setShareOpen] = useState(false);
    
    const[tagsOpen, setTagsOpen] = useState(false);
    const[newTag, setNewTag] = useState("");
    const[tags, setTags] = useState([]);

    const[renaming, setRenaming] = useState(false);

    const [icon, setIcon] = useState(null);
    
    const addTag = () => {
        if(tags.includes(newTag)) {
            return;
        }
        setTags([...tags, newTag]);
        setNewTag("");
    }

    const toggleTag = (tag) => () => {
        const currentIndex = tags.indexOf(tag);
        const newTags = [...tags];
    
        if (currentIndex === -1) {
            newTags.push(tag);
        } else {
          newTags.splice(currentIndex, 1);
        }
    
        setTags(newTags);
        // note.sharedWith = newChecked);
        // user.shared = !user.shared;
      };

    //TODO populate sharedWith from the note

    // function handleShare() {
    //     setShareOpen(true);
    // }


    const save = () => {
        //check if we've got all the stuff we need
        
        setTagsOpen(false);
        setShareOpen(false);
        
        if(!editor) {
            return;
        }

        if(openNote.id == -1) {
            api.createNote(campaignId, title, editor.getContent(), tags, sharedWith);
        } else {
            console.log("open note id", openNote.id);
            api.updateNote(openNote.id, campaignId, title, editor.getContent(), tags, sharedWith);
        }


    }

    const toggleShare = (userId) => () => {
        const currentIndex = sharedWith.indexOf(userId);
        const newSharedWith = [...sharedWith];
    
        if (currentIndex === -1) {
            newSharedWith.push(userId);
        } else {
          newSharedWith.splice(currentIndex, 1);
        }
    
        setSharedWith(newSharedWith);
        // note.sharedWith = newChecked);
        // user.shared = !user.shared;
      };

    useEffect(() => {
        api.getCurrentUser().then(currentUser => {
            if(note) {
                if(openNote != note && editor && editor.isDirty()) {
                    console.log("ope, whoopsie doopsie. you just lost all the change");
                }
                setOpenNote(note);
                setSharedWith([...note.sharedWith]);
                setTitle(note.title);
                setTags(note.tags);

                //set the user icon of the open note
                api.getUserIcon(note.userId).then(icon => {
                    setIcon(icon);
                });

                // setOpenNote({"title": title, "content": note.content, "tags": tags, "sharedWith": sharedWith, "campaignId": campaignId, "userId": note.userId})

                if(note.userId == currentUser.userId) {
                    setIsOwner(true);
                    editor.getBody().setAttribute('contenteditable', true);
                } else {
                    editor.getBody().setAttribute('contenteditable', false);
                    setIsOwner(false);
                }

                if(isOwner) {
                    let newUsers = [];
                    api.getCampaign(campaignId).then(cpn => {
                        let userIds = [cpn.ownerId, ...cpn.userIds];
                        for(let i = 0; i < userIds.length; i++) {
                            if(userIds[i]) {
                                api.getUser(userIds[i]).then(user => {
                                    newUsers[i] = user;
                                })
                            }                            
                            
                        }
                        setUsers(newUsers);
                    });
                }
            }
        }).catch(() => {
            // navigate("/login");
        });
        console.log("Note useEffect");
    },[note]);
 
    return (
    <Container>
        <header>
            <Avatar className="icon" alt="User icon"  src={icon} />
            <h2 onClick={() => setRenaming(isOwner)} name="title">{title}</h2> 
            {/* TODO editable header, im thinking if you click the title, it opens a dialogue to rename the note */}
        </header>


        <Backdrop open={renaming} sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Card variant="outlined" sx={{
                bgcolor: 'background.light', 
                color: 'white',
                my: 4,
                p: 4,}}>
                <CardContent>
                    <Typography>Enter a New Title</Typography>
                    <TextField placeholder={newTitle} onChange={(event) => setNewTitle(event.target.value)}> </TextField>
                </CardContent>
                <CardActions>
                    <Button variant="contained" onClick={() => {
                        setRenaming(false);
                        setTitle(newTitle);
                        setNewTitle("");
                        }}> Update Title </Button>

                    <Button variant="outlined" onClick={() => {
                        setRenaming(false);
                        setNewTilte("");
                    }}>Cancel</Button>
                </CardActions>
            </Card>
        </Backdrop>

        <TextEditor name="content" content={openNote.content} readOnly={!isOwner} editorCallback={setEditor}/>


        <Backdrop open={tagsOpen} sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Card variant="outlined" sx={{
                bgcolor: 'background.light', 
                color: 'white',
                my: 4,
                p: 4,
                
            }}>
                <CardContent className='tags'>
                    {/* <div name="tags" className="tagContainer"> */}
                    <List dense>
                        {tags.map(tag => {
                            const labelId = `checkbox-list-label-${tag}`;
                            return (
                            <ListItemButton role={undefined} key={labelId} onClick={toggleTag(tag)}>
                                <ListItemIcon>
                                    <Tag content={tag}></Tag>
                                </ListItemIcon>
                                <ListItemIcon>
                                    <FaTrash></FaTrash>
                                </ListItemIcon>
                            </ListItemButton>
                        )})}
                    </List>
                    <Divider></Divider>
                    <TextField id="newTag" placeholder="New Tag" shrink="true" variant="outlined" onChange={(event) => setNewTag(event.target.value)} sx={{textcolor: "white"}}/>
                    <Button onClick={addTag} variant="contained"> Add Tag </Button>
                </CardContent>
                <Divider></Divider>
                <CardActions>
                    <br/>
                    <Button variant="contained" onClick={save}> Save Note </Button>
                    <Button onClick={() => setTagsOpen(false)} variant="outlined">Cancel</Button>
                </CardActions>
            </Card>
        </Backdrop>

        <Backdrop
            sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={shareOpen}
        >
            <Card sx={{bgcolor: 'background.light', color: 'white'}}>
                <CardContent>
                    <List>
                        {users.map(user => {
                            const labelId = `checkbox-list-label-${user.userId}`;
                            return (
                            <ListItemButton role={undefined} key={labelId} onClick={toggleShare(user.userId)}>
                                <ListItemAvatar>
                                    <Avatar alt={`profile picture for ${user.first_name}`} src={user.icon}/>
                                </ListItemAvatar>
                                <ListItemText id={labelId} primary={`${user.first_name } ${user.last_name}`} />
                                <ListItemIcon>
                                    <Checkbox
                                    color="secondary"
                                    edge="end"
                                    // onChange={}
                                    checked={sharedWith.indexOf(user.userId) !== -1}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                    disableRipple
                                    />
                                </ListItemIcon>
                            </ListItemButton>
                        )})}
                    </List>
                </CardContent>
                <Divider></Divider>
                <CardActions>
                    <Button variant="contained" onClick={save}>Save & Share</Button>
                    <Button variant="outlined" onClick={() => {setShareOpen(false)}}>Cancel</Button>
                </CardActions>
            </Card>
        </Backdrop>


        <ButtonGroup>
        <Button variant="contained" disabled={!isOwner} onClick={() => setTagsOpen(true)}> Tags </Button>
        <Button variant="contained" disabled={!isOwner} onClick={()=>{setShareOpen(true)}}>Share</Button>
        <Button variant="contained" disabled={!isOwner} onClick={save}>Save</Button>
        </ButtonGroup>

    </Container>
    );
}