import Tag from "../Tag/Tag";
import { useEffect, useState } from "react";
import './notePreview.css';


export default function NotePreview({id, title, content, tags}) {
    const [noteTags, setTags] = useState(tags);

    return (
        <>
        <div className="notePreviewComponent">
            <header>
                <img className="icon" src="https://robohash.org/veniamdoloresenim.png?size=64x64&set=set1" alt="user icon" />
                <h2>{title}</h2>
                <time>1hr ago</time>
            </header>
            
            <p>{content}</p>
            <div className="tagContainer">
                {noteTags.map(tag => (
                    <Tag content={tag}/>
                ))}
            </div>
        </div>
        </>
    );
}