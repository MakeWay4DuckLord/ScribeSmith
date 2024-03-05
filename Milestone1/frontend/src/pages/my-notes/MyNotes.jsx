import './myNotes.css'
import { FaCirclePlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import NotePreview from "../../components/NotePreview/NotePreview";
import Note from "../../components/Note/Note";
import Tag from "../../components/Tag/Tag";

export default function MyNotes() {
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
                    {/* <NotePreview />
                    <NotePreview />
                    <NotePreview />
                    <NotePreview />
                    <NotePreview />
                    <NotePreview /> */}

                    <Note id="1" title="Note Title" content="In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy." tags='["session1", "tag2"]'/>
                    <Note id="2" title="Note Title" content="In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy." tags='["session2", "tag3"]'/>

                </div>
                <main>
                </main>
            </aside>
        </div>
    );
}