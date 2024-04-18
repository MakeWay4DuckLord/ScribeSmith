import Tag from "../Tag/Tag";
import TextEditor from "../TextEditor/TextEditor";
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Container from '@mui/material/Container';
import {
    Card, CardContent, CardActions, Container, CardHeader,
    Button, Backdrop, IconButton, Box,
    List, ListItemButton, ListItem, ListItemAvatar, ListItemText, ListItemIcon, Avatar,
    Checkbox, TextField, Divider, Typography,
    SpeedDial, SpeedDialAction, SpeedDialIcon,
    Dialog, DialogContent, DialogTitle, DialogContentText
} from '@mui/material';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../client/APIClient";
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import SellIcon from '@mui/icons-material/Sell';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { FaTrash, FaUndo } from "react-icons/fa";

import './note.css'


function onSubmit(e) {
    e.preventDefault();
    console.log('preventing default');
}
//{title: "New Note", content: "", tags: [], id:-1, campaignId:-1, sharedWith: []}
export default function Note({ note, saveCallback, newNoteCallback }) {
    const [openNote, setOpenNote] = useState({});
    const [isOwner, setIsOwner] = useState(false);
    const { campaignId } = useParams();

    const [title, setTitle] = useState("New Note");
    const [newTitle, setNewTitle] = useState("");

    const [sharedWith, setSharedWith] = useState([]);
    const [users, setUsers] = useState([]);

    const [editor, setEditor] = useState(null);
    const navigate = useNavigate();

    const [shareOpen, setShareOpen] = useState(false);

    const [tagsOpen, setTagsOpen] = useState(false);
    const [newTag, setNewTag] = useState(null);
    const [tags, setTags] = useState([]);


    const [tempTagsToDelete, setTempTagsToDelete] = useState([]);
    const [isNewTagOpen, setIsNewTagOpen] = useState(false);


    const [renaming, setRenaming] = useState(false);

    // const[createNoteDialogue, setCreateNoteDialogue] = useState(false);
    const [SaveChangesDialogue, setSaveChangesDialogue] = useState(false);

    const [icon, setIcon] = useState(null);

    const addTag = () => {
        setTags([...tags, newTag]);
        setNewTag("");
    }
    
    const addNewTag = () => {
        setIsNewTagOpen(false);
        if (tags.includes(newTag)) {
            return;
        }
        if(newTag !== "") {
            const updatedTags = [...tags, newTag];
            setTags(updatedTags);
        }
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

    //TODO populate sharedWith from the note

    // function handleShare() {
    //     setShareOpen(true);
    // }

    function updateNote(newNote) {
        setOpenNote(newNote);
        setSharedWith([...newNote.sharedWith]);
        setTitle(newNote.title);
        setTags(newNote.tags)
        api.getUserIcon(newNote.userId).then(icon => {
            setIcon(icon);
        });
    }

    const save = () => {
        //check if we've got all the stuff we need

        setTagsOpen(false);
        setShareOpen(false);

        if (!editor) {
            return;
        }

        if (openNote.id == -1) {
            throw new Error("attempted to save a note that hasn't been made yet")
            // api.createNote(campaignId, title, editor.getContent(), tags, sharedWith).then(currentNote => {
            //     updateNote(currentNote);
            // });
        } else {
            api.updateNote(openNote.id, campaignId, title, editor.getContent(), tags, sharedWith).then(newNote => {
                console.log(newNote);
                updateNote(newNote);
            }
            );

        }

        saveCallback();
    }

    const actions = [
        { icon: <SaveIcon />, name: 'Save', handler: save },
        { icon: <ShareIcon />, name: 'Share', handler: () => setShareOpen(true) },
        { icon: <SellIcon />, name: 'Edit Tags', handler: () => setTagsOpen(true) },
        { icon: <NoteAddIcon />, name: 'Create New Note', handler: newNoteCallback }
    ];

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
            if (note && note.id != -1) {
                if (openNote != note && editor && editor.isDirty()) {
                    console.log("ope, whoopsie doopsie. you just lost all the change");
                    setSaveChangesDialogue(true);
                }
                // if(note != openNote) {
                // if(note.id == openNote.id) {
                updateNote(note);
                // }
                // }
                if (note.userId == currentUser.userId) {
                    setIsOwner(true);
                    editor.getBody().setAttribute('contenteditable', true);
                } else {
                    editor.getBody().setAttribute('contenteditable', false);
                    setIsOwner(false);
                }

                if (isOwner) {
                    let newUsers = [];
                    api.getCampaign(campaignId).then(cpn => {
                        let userIds = [cpn.ownerId, ...cpn.userIds];
                        for (let i = 0; i < userIds.length; i++) {
                            if (userIds[i]) {
                                api.getUser(userIds[i]).then(user => {
                                    newUsers[i] = user;
                                })
                            }

                        }
                        setUsers(newUsers);
                    });
                }
            }
        }).catch((error) => {
            if (error.status == "401") {
                navigate("/login");
            }
        });
        console.log("Note useEffect");
    }, [note]);


    //If there is no open note, show options to create a new note

    return (
        <Container className="note-component">

            <Card variant="outlined" sx={{
                bgcolor: 'background.light',
                color: 'white',
                my: 4,
                p: 2,

            }}>

                {/* <Button onClick={() => console.log(openNote)}>DEBUG</Button> */}
                <CardHeader
                    avatar={
                        <Avatar className="icon" alt="User icon" src={icon} />
                    }
                    title={title}
                    // subtitle={{}} TODO make a subtitle. could be: list of tags, timestamp, user who wrote the note, etc
                    onClick={() => setRenaming(isOwner)}
                />
                {/* <Typography variant="h3" onClick={() => setRenaming(isOwner)} name="title">{title}</Typography>  */}
                {/* TODO editable header, im thinking if you click the title, it opens a dialogue to rename the note */}
                {/* </CardHeader> */}

                <CardContent>
                    <TextEditor name="content" content={openNote.content} readOnly={!isOwner} editorCallback={setEditor} />
                </CardContent>

                {/* <CardActions> */}

                {/* <Button variant="contained" disabled={!isOwner} onClick={() => setTagsOpen(true)}> Tags </Button>
                    <Button variant="contained" disabled={!isOwner} onClick={() => { setShareOpen(true) }}>Share</Button>
                    <Button variant="contained" disabled={!isOwner} onClick={save}>Save</Button> */}
                {/* </CardActions> */}
                <SpeedDial
                    ariaLabel="Note SpeedDial"
                    // sx={{ position: 'absolute', bottom: 16, right: 16 }}
                    icon={<SpeedDialIcon />}
                    hidden={!isOwner}
                    direction="left"
                >
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={action.handler}
                        />
                    ))}
                </SpeedDial>
            </Card>


            {/* <Button className="tagButton" onClick={handleClickTagOpen}>Edit Campaign Tags</Button> */}
            <Dialog
                onClose={() => {        
                    setTagsOpen(false);
                    //delete all of the tags that the user selected
                    
                    const updatedTags = tags.filter(tag => !tempTagsToDelete.includes(tag));
                    setTags(updatedTags);}}
                open={tagsOpen}
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

                        {tags.map((tag, index) => (
                            <div className="tagContainer">
                                <Tag content={tag} key={index} />
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
                                <TextField id="standard-basic" label="Tag Name" variant="standard" onChange={(event) => {setNewTag(event.target.value)}} />
                                <button type="button" onClick={addNewTag}>Add</button>
                            </div>
                            :
                            <></>
                        }

                    </DialogContentText>
                </DialogContent>
            </Dialog>

            {/* <Backdrop open={tagsOpen} sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Card sx={{
                    bgcolor: 'background.light',
                    color: 'white',
                    my: 4,
                    p: 4
                }}>
                    <CardContent className='tags'>
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
                                )
                            })}
                        </List>
                        <Divider></Divider>
                        <TextField className="text-field" id="newTag" placeholder="New Tag" shrink="true" variant="outlined" onChange={(event) => setNewTag(event.target.value)} sx={{ color: "white" }} />
                        <Button onClick={addTag} variant="contained"> Add Tag </Button>
                    </CardContent>
                    <Divider></Divider>
                    <CardActions>
                        <br />
                        <Button variant="contained" onClick={save}> Save Note </Button>
                        <Button onClick={() => setTagsOpen(false)} variant="outlined">Cancel</Button>
                    </CardActions>
                </Card>
            </Backdrop> */}

            <Backdrop sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={shareOpen}>
                <Card sx={{
                    bgcolor: 'background.light',
                    color: 'white',
                    my: 4,
                    p: 4
                }}>
                    <CardContent>
                        <List>
                            {users.map(user => {
                                const labelId = `checkbox-list-label-${user.userId}`;
                                return (
                                    <ListItemButton role={undefined} key={labelId} onClick={toggleShare(user.userId)}>
                                        <ListItemAvatar>
                                            <Avatar alt={`profile picture for ${user.first_name}`} src={user.icon} />
                                        </ListItemAvatar>
                                        <ListItemText id={labelId} primary={`${user.first_name} ${user.last_name}`} />
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
                                )
                            })}
                        </List>
                    </CardContent>
                    <Divider></Divider>
                    <CardActions>
                        <Button variant="contained" onClick={save}>Save & Share</Button>
                        <Button variant="outlined" onClick={() => { setShareOpen(false) }}>Cancel</Button>
                    </CardActions>
                </Card>
            </Backdrop>

            <Backdrop open={renaming} sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Card sx={{
                    bgcolor: '#494251',
                    color: 'white',
                    my: 4,
                    p: 4
                }}>
                    <CardContent>
                        <Typography>Enter a New Title</Typography>
                        <TextField id="newTitle" className="text-field" placeholder={newTitle} onChange={(event) => setNewTitle(event.target.value)}> </TextField>
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" onClick={() => {
                            setRenaming(false);
                            setTitle(newTitle);
                            setNewTitle("");
                        }}> Update Title </Button>

                        <Button variant="outlined" onClick={() => {
                            setRenaming(false);
                            setNewTitle("");
                        }}>Cancel</Button>
                    </CardActions>
                </Card>
            </Backdrop>

        </Container>
    );
}