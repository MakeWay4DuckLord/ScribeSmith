import Tag from "../Tag/Tag";
import TextEditor from "../TextEditor/TextEditor";
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Container from '@mui/material/Container';
import {Card, CardContent, CardActions, Container, Button, Backdrop, List, ListItemButton, ListItemAvatar, ListItemText, ListItemIcon, Avatar, Checkbox} from '@mui/material';
import { useEffect, useState} from "react";
import {useParams} from "react-router-dom";
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
    const[shareOpen, setShareOpen] = useState(false);
    const[isNew, setIsNew] = useState(true);
    const[currentUser, setCurrentUser] = useState({});
    const[isOwner, setIsOwner] = useState(false);
    const {campaignId} = useParams();
    
    const[sharedWith, setSharedWith] = useState([]);
    const[users, setUsers] = useState([]);
    //TODO populate sharedWith from the note

    // function handleShare() {
    //     setShareOpen(true);
    // }

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

                if(note.id != -1) {
                    setIsNew(false);
                    setSharedWith[note.sharedWith];
                } 
                
                setOpenNote(note);
                console.log(note);
                if(note.userId == currentUser.userId) {
                    setIsOwner(true);
                } else {
                    setIsOwner(false);
                }
                if(isOwner) {
                    api.getCampaign(campaignId).then(cpn => {
                        for(let i = 0; i < cpn.userIds.length; i++) {                            
                            api.getUser(cpn.userIds[i]).then(user => {
                                users[i] = user;
                            })
    
                        }
                    })
                }
            }
        }).catch(() => {
            navigate("/login");
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

        <TextEditor name="content" content={openNote.content} readOnly={!isOwner} saveCallback={save}/>

        <Card variant="outlined" sx={{
            bgcolor: 'background.light', 
            color: 'white',
            my: 4,
            p: 4,
            
        }}>
            <CardContent className='tags'>
                <div name="tags" className="tagContainer">
                    {openNote.tags.map((tag, index) => (
                        <Tag content={tag} key={index}/>
                        ))}
                </div>
            </CardContent>
        </Card>

        <Button variant="contained" onClick={()=>{setShareOpen(true)}}>Share</Button>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={shareOpen}
        >
            <Card sx={{bgcolor: 'background.light'}}>
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
                                    edge="end"
                                    // onChange={}
                                    checked={sharedWith.includes(user.userId) !== -1}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                    disableRipple
                                    />
                                </ListItemIcon>

                            </ListItemButton>
                        )})}
                    </List>
                </CardContent>
                <CardActions>
                    <Button variant="contained" onClick={()=>{setShareOpen(false)}}>Save Changes</Button>
                    <Button variant="contained" onClick={() => {setShareOpen(false)}}>Cancel</Button>
                </CardActions>
            </Card>
        </Backdrop>

    </Container>
    );
}