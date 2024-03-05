import './myNotes.css'
import { FaCirclePlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import NotePreview from "../../components/NotePreview/NotePreview";
import Note from "../../components/Note/Note";
import Tag from "../../components/Tag/Tag";
import api from "../../client/APIClient";

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function MyNotes() {
    const[myNotes, setNotes] = useState([]);
    const {id} = useParams();
    const [error, setError] = useState(null);

    useEffect(() => {

        api.getCampaignNotesByUser(id, "1").then(notes => { //TODO unhardcode user id this once we know how
            setNotes(notes);
        }).catch(err => {
            setError(true);
        });
    }, []);

    if(error === true) {
        return <h1>Error loading notes.</h1>
    }


    return(
        <div className='myNotes'>
            <aside>
                <h1>My Notes</h1>
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
                    {myNotes.map(note => (
                        <Note id={note.id} title={note.title} content={note.content} tags={note.tags}/>
                    ))}

                    {/* hard coded notes for testing and such */}
                    {/* <Note id="1" title="Note Title" content="In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy." tags={["session1", "tag2"]}/>
                    <Note id="2" title="Note Title" content="In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy." tags={["session2", "tag3"]}/> */}

                </div>
                <main>
                </main>
            </aside>
        </div>
    );
}