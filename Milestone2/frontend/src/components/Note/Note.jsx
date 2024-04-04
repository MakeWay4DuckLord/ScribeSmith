import Tag from "../Tag/Tag";
import TextEditor from "../TextEditor/TextEditor";
import Container from '@mui/material/Container';
import { useEffect, useState} from "react";

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
    const[openNote, setOpenNote] = useState({title: "New Note", content: "", tags: [], id:-1, campaignId:-1});
    useEffect(() => {
        if(note) {
            setOpenNote(note);
        }
        console.log("Note useEffect");
    },[note]);
 
    return (
        <Container>
        <form className='note' action={save}>
            <header>
                <img className="icon" src="https://robohash.org/veniamdoloresenim.png?size=64x64&set=set1" alt="user icon" />
                <h2 name="title">{openNote.title}</h2>
                <time>1hr ago</time>
            </header>
                <TextEditor name="content" content={openNote.content} saveCallback={save}/>

            
            <div name="tags" className="tagContainer">
                {openNote.tags.map((tag, index) => (
                    <Tag content={tag} key={index}/>
                    ))}
            </div>
        </form>
        </Container>
    );
}