import './noteBrowser.css'
import { FaCirclePlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import NotePreview from "../../components/NotePreview/NotePreview";
import Note from "../../components/Note/Note";
import Tag from "../../components/Tag/Tag";
import api from "../../client/APIClient";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SpeedDial, SpeedDialIcon, SpeedDialAction, Button, Box, IconButton, Container, Card, CardActions, CardContent, Backdrop, Typography, TextField, Drawer } from '@mui/material';

import { GiBookshelf } from "react-icons/gi";
import SearchIcon from '@mui/icons-material/Search';

export default function NoteBrowser({ title, notes, campaignTags, saveCallback }) {
    const [openIndex, setOpenIndex] = useState(-1);
    const [openNote, setOpenNote] = useState(null);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchedTags, setSearchedTags] = useState([]);
    const { campaignId } = useParams();

    const [createNoteDialogue, setCreateNoteDialogue] = useState(false);

    const [browserOpen, setBrowserOpen] = useState(false);



    const drawerWidth = 450;

    function updateNote(note) {
        // setOpenIndex(filteredNotes.indexOf(note));
        setOpenNote(note);
    }

    function tagOnClick(tag) {
        console.log(tag);
        const index = selectedTags.indexOf(tag);
        if (index > -1) {
            const newSelectedTags = [...selectedTags];
            newSelectedTags.splice(index, 1);
            setSelectedTags(newSelectedTags);
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    }

    function updateSearch(event) {
        const searchBar = event.target.value;
        // if(searchBar) {
        if (searchBar.length == 0) {
            setSearchedTags([]);
        } else {
            const tagArray = searchBar.split(" ").filter(tag => tag.charAt(0) == "#").map(tag => tag.substring(1));
            setSearchedTags(tagArray);
        }
        console.log("selected tags: ", searchedTags);

    }

    const DisplayNote = () => {
        if (openNote) {
            return (
                <Note note={openNote} saveCallback={saveCallback} newNoteCallback={() => setCreateNoteDialogue(true)} />
            )
        } else if (title == "My Notes") {
            return (
                <Card sx={{
                    bgcolor: 'background.light',
                    m: 3,
                    p: 3,
                    color: 'white',
                }}>
                    <CardContent>
                        Select a note from the browser or create a new note.
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" className="friendly-button" onClick={() => { setCreateNoteDialogue(true) }}>Create New Note</Button>
                    </CardActions>
                </Card>
            )
        } else {
            return (
                <Card sx={{
                    bgcolor: 'background.light',
                    color: 'white',
                    m: 3,
                    p: 3,
                }}>
                    <CardContent>
                        Select a note from the browser
                    </CardContent>
                </Card>
            );
        }
    }

    useEffect(() => {

        //console.log(selectedTags, searchedTags, [...selectedTags,...searchedTags]);
        if (notes.length !== 0) {
            //filter for notes that have all of the selected tags            
            setFilteredNotes(notes.filter(note => [...selectedTags, ...searchedTags].filter(tag => !note.tags.includes(tag)).length == 0));



            if (openNote && !notes.includes(openNote)) {
                for (let i = 0; i < notes.length; i++) {
                    const currentNote = notes[i];
                    if (currentNote.id == openNote.id) {
                        setOpenNote(currentNote);
                        break;
                    }
                }
            }
        }
    }, [notes, selectedTags, searchedTags, campaignTags]);

    const drawerContents = (
        <Box sx={{
            color: 'white', fontFamily: 'Inter,system-ui,Avenir,Helvetica,Arial,sans-serif',
            alignContent: 'center',
            padding: '20px',
            overflowY: 'scroll'

        }}>
            <h1>{title}</h1>
            <Box sx={{
                color: 'white',
                w: 0.8,
                marginBottom: '10px',
            }}>

                {/* <SearchIcon fontSize='large'/> */}
                <TextField color='primary' id="search-bar" placeholder='Search...' onChange={updateSearch}
                    sx={{
                        w: 1,
                        bgcolor: 'white',
                        color: 'black',
                        fontSize: '15px',
                        borderRadius: '10px',
                    }}
                    fullWidth='true'
                />

            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'baseline',
                maxWidth: drawerWidth,
                overflowX: 'scroll',
                minHeight: '50px',
                maxHeight: '75px',
                py: 2,
            }}>
                {campaignTags.map(tag => (
                    //this style thing is not ideal, i bet React could do something better
                    <div onClick={() => { tagOnClick(tag) }} key={campaignTags.indexOf(tag)} style={{
                        backgroundColor: selectedTags.includes(tag) ? 'lightblue' : '',
                        borderRadius: 5,
                        padding: 5,
                        width: 'fit-content'
                    }}>
                        <Tag content={tag} />
                    </div>
                ))}
                {/* <FaCirclePlus className='addTagIcon' fontSize={'large'} onClick={() => setViewTags(true)}/> */}
            </Box>
            <div className='note-container'>
                {filteredNotes.map(note => (
                    <div onClick={() => { updateNote(note) }} key={note.id}>
                        <NotePreview noteId={note.id} ownerId={note.userId} title={note.title} content={note.content} tags={note.tags} />
                    </div>
                ))}

                {/* hard coded notes for testing and such */}
                {/* <Note id="1" title="Note Title" content="In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy." tags={["session1", "tag2"]}/>
                        <Note id="2" title="Note Title" content="In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy." tags={["session2", "tag3"]}/> */}

            </div>
        </Box>
    );


    return (
        <div className='noteBrowser'>
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="note feed"
            >

                <Drawer variant='temporary' open={browserOpen} onClose={() => setBrowserOpen(false)}
                    sx={{ display: { xs: 'block', md: 'none' } }}
                    PaperProps={{
                        sx: {
                            backgroundColor: 'background.main',
                            px: 2,
                            py: 4,
                            height: 'calc(100% - 60px)',
                            maxWidth: drawerWidth,
                            overflow: 'hidden',
                        }
                    }}
                    children={drawerContents} />
                <Drawer variant='permanent' sx={{
                    display: { xs: 'none', md: 'block' },
                }}
                    PaperProps={{
                        sx: {
                            backgroundColor: 'background.main',
                            px: 2,
                            py: 4,
                            // marginTop: '60px',
                            height: 'calc(100% - 60px)',
                            zIndex: 98, //just below header
                            width: drawerWidth,
                            overflow: 'hidden',
                        }
                    }}
                    children={drawerContents}
                />
            </Box>
            <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
                <Button onClick={() => setBrowserOpen(true)} startIcon={<GiBookshelf className="icon" />} sx={{
                    display: { xs: 'inline-block', md: 'none' }
                }}>
                    Open Note Browser
                </Button>
                <DisplayNote />
            </Box>

            <Backdrop open={createNoteDialogue} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Card variant="outlined" sx={{
                    bgcolor: "background.light",
                    my: 4,
                    p: 4,
                }}>
                    <CardContent>
                        <Typography>Enter a title for your new note:</Typography>
                        <TextField id="new-note-title-field" placeholder="New Note"> </TextField>
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" onClick={() => {
                            let newTitle = document.querySelector("#new-note-title-field").value;


                            api.createNote(campaignId, newTitle, "", [], []).then(currentNote => {
                                setOpenNote(currentNote)
                                setCreateNoteDialogue(false);
                                saveCallback();
                            });


                        }}> Create Note </Button>

                        <Button variant="outlined" onClick={() => {
                            setCreateNoteDialogue(false);
                            setNewNoteTitle("");
                        }}>Cancel</Button>
                    </CardActions>
                </Card>
            </Backdrop>

            

        </div>
    );
}