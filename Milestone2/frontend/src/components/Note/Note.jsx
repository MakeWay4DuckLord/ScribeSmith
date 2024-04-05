import Tag from "../Tag/Tag";
import TextEditor from "../TextEditor/TextEditor";
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Container from '@mui/material/Container';
import {
    Card,
    CardContent, 
    CardActions, 
    Container, 
    Button, 
    Backdrop, 
    List, 
    ListItemButton,
    ListItem, 
    ListItemAvatar, 
    ListItemText, 
    ListItemIcon, 
    Avatar, 
    Checkbox,
    TextField, 
    Divider
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

export default function Note({note}) {
    const[openNote, setOpenNote] = useState({title: "New Note", content: "", tags: [], id:-1, campaignId:-1, sharedWith: []});
    const[currentUser, setCurrentUser] = useState({});
    const[isOwner, setIsOwner] = useState(false);
    const {campaignId} = useParams();
    
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
            api.createNote(campaignId, openNote.title, editor.getContent(), openNote.tags, sharedWith);
        } else {
            api.updateNote(openNote.id, campaignId, openNote.title, editor.getContent(), openNote.tags, sharedWith);
        }


    }

    const shareAndSave = () => {
        save();
        setShareOpen(false);
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
            setCurrentUser(currentUser);
            console.log(currentUser)
            if(note) {
                if(openNote != note && editor && editor.isDirty()) {
                    console.log("ope, whoopsie doopsie. you just lost all the change");
                }
                setOpenNote(note);
                setSharedWith([...openNote.sharedWith]);
                setTags(note.tags);
                if(note.userId == currentUser.userId) {
                    setIsOwner(true);
                } else {
                    setIsOwner(false);
                }
                if(isOwner) {
                    let newUsers = [];
                    api.getCampaign(campaignId).then(cpn => {
                        let userIds = [cpn.ownerId, ...cpn.userIds];
                        for(let i = 0; i < userIds.length; i++) {                            
                            api.getUser(userIds[i]).then(user => {
                                newUsers[i] = user;
                            })
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
            <img className="icon" src="https://robohash.org/veniamdoloresenim.png?size=64x64&set=set1" alt="user icon" />
            <h2 name="title">{openNote.title}</h2>
            <time>1hr ago</time>
        </header>
{/*  */}
        <TextEditor name="content" content={openNote.content} readOnly={!isOwner} editorCallback={setEditor}/>


        <Button variant="contained" onClick={() => setTagsOpen(true)}> Tags </Button>
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

        <Button variant="contained" onClick={()=>{setShareOpen(true)}}>Share</Button>
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

        <Button variant="contained" onClick={save}>Save</Button>

    </Container>
    );
}