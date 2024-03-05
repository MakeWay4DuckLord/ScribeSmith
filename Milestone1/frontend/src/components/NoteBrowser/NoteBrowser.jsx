import './noteBrowser.css'
import { FaCirclePlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import NotePreview from "../../components/NotePreview/NotePreview";
import Note from "../../components/Note/Note";
import Tag from "../../components/Tag/Tag";
import api from "../../client/APIClient";

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function NoteBrowser({title, notes}) {

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
                        <NotePreview key={note.id} id={note.id} title={note.title} content={note.content} tags={note.tags}/>
                    ))}

                    {/* hard coded notes for testing and such */}
                    {/* <Note id="1" title="Note Title" content="In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy." tags={["session1", "tag2"]}/>
                    <Note id="2" title="Note Title" content="In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy." tags={["session2", "tag3"]}/> */}

                </div>
                <main>
                    <Note />
                </main>
            </aside>
        </div>
    );
}