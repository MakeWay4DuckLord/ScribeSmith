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



export default function NoteBrowser({title, notes}) {
    const[openNote, setOpenNote] = useState({title: "New Note", content: "", tags: []});
    
    function updateNote(note) {
        setOpenNote(note);
    }

    useEffect(() => {
        if(notes.length !== 0) {
            setOpenNote(notes[0]);
        } else {
            setOpenNote({title: "New Note", content: "", tags: []});
        }
    }, [notes]);


    return(
        <div className='noteBrowser'>
            <aside>
                <h1>{title}</h1>
                <search>
                    <input type="text" placeholder='Search...' />
                    <IoIosSearch className='searchIcon' />

                </search>
                <div className='tagList'>
                    <Tag content={"session1"}/>
                    <Tag content={"session2"}/>
                    <Tag content={"session4"}/>
                    <FaCirclePlus className='addTagIcon' />
                </div>

                <div className='note-container'>
                    {notes.map(note => (
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