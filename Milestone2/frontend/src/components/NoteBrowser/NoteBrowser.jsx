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


// function getSearchedTags() {
//         const tagArray = searchBar.split(" ").filter(tag => tag.charAt(0) == "#").map(tag => tag.substring(1));
//         console.log(tagArray);
//         return tagArray
// }


export default function NoteBrowser({title, notes}) {
    const[openNote, setOpenNote] = useState({title: "New Note", content: "", tags: []});
    const[filteredNotes, setFilteredNotes] = useState([]);
    const[selectedTags, setSelectedTags] = useState([]);
    const{cpnId} = useParams();
    // const[searchBar, setSearchBar] = useState("");
    
    function updateNote(note) { 
        setOpenNote(note);
    }

    function updateSearch(event) {
        const searchBar = event.target.value;
        // if(searchBar) {
            if(searchBar.length == 0) {
                setSelectedTags([]);
            } else {
                const tagArray = searchBar.split(" ").filter(tag => tag.charAt(0) == "#").map(tag => tag.substring(1));
                setSelectedTags(tagArray);
            }
            console.log("selected tags: ", selectedTags);
        // }
    }

    // function tagOnClick(tag) {
    //     let searchBar =  document.querySelector("#search-bar");
    //     if(searchBar) {
    //         searchBar.value += ` ${tag} `;
    //     }
    // }

    useEffect(() => {
        if(notes.length !== 0) {
            setOpenNote(notes[0]);

            setFilteredNotes(notes);

            //filter for notes that have all of the selected tags

            
            setFilteredNotes(notes.filter(note => selectedTags.filter(tag => !note.tags.includes(tag)).length == 0)); // and filtering
            
            // if(selectedTags.length > 0){
                // setFilteredNotes(notes.filter(note => selectedTags.filter(tag => note.tags.includes(tag)).length > 0)); // or filtering
            // }
        } else {
            setOpenNote({title: "New Note", content: "", tags: []});
        }
        console.log(cpnId);
    }, [notes, selectedTags]);


    return(
        <div className='noteBrowser'>
            <aside>
                <h1>{title}</h1>
                <search>
                    <input type="text" id="search-bar" placeholder='Search...' onChange={updateSearch}/>
                    <IoIosSearch className='searchIcon' />

                </search>
                <div className='tagList'>
                    <Tag content={"session1"}/>
                    <Tag content={"session2"}/>
                    <Tag content={"session4"}/>
                    <FaCirclePlus className='addTagIcon' />
                </div>

                <div className='note-container'>
                    {filteredNotes.map(note => (
                        <div onClick={()=>{updateNote(note)}} key={note.id}>
                            <NotePreview  id={note.id} title={note.title} content={note.content} tags={note.tags}/>
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