import './noteBrowser.css'
import { FaCirclePlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import NotePreview from "../../components/NotePreview/NotePreview";
import Note from "../../components/Note/Note";
import Tag from "../../components/Tag/Tag";
import api from "../../client/APIClient";
import TextEditor from '../TextEditor/TextEditor';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Campaign from '../../pages/campaign/Campaign';
import { Button } from '@mui/material';


// function getSearchedTags() {
//         const tagArray = searchBar.split(" ").filter(tag => tag.charAt(0) == "#").map(tag => tag.substring(1));
//         console.log(tagArray);
//         return tagArray
// }


export default function NoteBrowser({title, notes, campaignTags}) {
    const[openNote, setOpenNote] = useState({title: "New Note", content: "", tags: []});
    const[filteredNotes, setFilteredNotes] = useState([]);
    const[selectedTags, setSelectedTags] = useState([]);
    const[searchedTags, setSearchedTags] = useState([]);
    const{campaignId} = useParams();
    // const[tags, setTags] = useState(campaignTags);
    // const[searchBar, setSearchBar] = useState("");\

    function newNote() {
        api.getCurrentUser().then(user => {
            updateNote({title: "New Note", userId: user.userId, content: "", tags: [], id:-1, campaignId, sharedWith: []});
        })
    }
    
    function updateNote(note) { 
        setOpenNote(note);
    }

    const changeCallback = (content) => {
        openNote.content = content;

    }

    function tagOnClick(tag) {
        console.log(tag);
        const index = selectedTags.indexOf(tag);
        if(index > -1) {
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
            if(searchBar.length == 0) {
                setSearchedTags([]);
            } else {
                const tagArray = searchBar.split(" ").filter(tag => tag.charAt(0) == "#").map(tag => tag.substring(1));
                setSearchedTags(tagArray);
            }
            console.log("selected tags: ", searchedTags);
            // setSelectedTags([...searchedTags, ...selectedTags]);
        // }
    }

    // function tagOnClick(tag) {
    //     let searchBar =  document.querySelector("#search-bar");
    //     if(searchBar) {
    //         searchBar.value += ` ${tag} `;
    //     }
    // }

    useEffect(() => {
        //console.log(selectedTags, searchedTags, [...selectedTags,...searchedTags]);
        if(notes.length !== 0) {
            //filter for notes that have all of the selected tags            
            setFilteredNotes(notes.filter(note => [...selectedTags, ...searchedTags].filter(tag => !note.tags.includes(tag)).length == 0));
            
            // filter notes that have any of the selected tags
            // setFilteredNotes(notes);
            // if(selectedTags.length > 0){
            //     setFilteredNotes(notes.filter(note => selectedTags.filter(tag => note.tags.includes(tag)).length > 0));
            // }
                
            //TODO consider adding a way to switch between and vs or filtering
            setOpenNote(notes[0]);
        } else {
            setOpenNote(null);
        }
    }, [notes, selectedTags, searchedTags, campaignTags]);


    return(
        <div className='noteBrowser'>
            <aside>
                <h1>{title}</h1>
                <search>
                    <input type="text" id="search-bar" placeholder='Search...' onChange={updateSearch}/>
                    <IoIosSearch className='searchIcon' />
                </search>
                <div className='tagList'>
                    {campaignTags.map(tag => (
                        //this style thing is not ideal, i bet React could do something better
                        <div onClick={()=>{tagOnClick(tag)}} key={campaignTags.indexOf(tag)} style={{
                            backgroundColor: selectedTags.includes(tag) ? 'lightblue' : '', //placeholder, lightblue is kinda weird
                            borderRadius: 5,
                        }}>
                            <Tag content={tag} />
                        </div>
                    ))}
                <FaCirclePlus className='addTagIcon' />
                </div>

                <Button variant="contained" onClick={newNote}>Create New Note</Button>

                <div className='note-container'>
                    {filteredNotes.map(note => (
                        <div onClick={()=>{updateNote(note)}} key={note.id}>
                            <NotePreview  noteId={note.id} ownerId={note.userId} title={note.title} content={note.content} tags={note.tags}/>
                        </div>
                    ))}

                    {/* hard coded notes for testing and such */}
                    {/* <Note id="1" title="Note Title" content="In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy." tags={["session1", "tag2"]}/>
                    <Note id="2" title="Note Title" content="In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy." tags={["session2", "tag3"]}/> */}

                </div>
            </aside>
            <main>
                <Note note={openNote} />
            </main>
        </div>
    );
}