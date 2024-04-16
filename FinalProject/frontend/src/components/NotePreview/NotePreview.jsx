import Tag from "../Tag/Tag";
import { useEffect, useState } from "react";
import './notePreview.css';
import api from "../../client/APIClient";
import Avatar from '@mui/material/Avatar';


export default function NotePreview({noteId, ownerId, title, content, tags}) {
    const [icon, setIcon] = useState(null);
    useEffect(() => {
        api.getUserIcon(ownerId).then(icon => {
            setIcon(icon);
        });
    }, [])
    

    return (
        <>
        <div className="notePreviewComponent">
            <header>
                <Avatar className="icon" alt="User icon"  src={icon} />
                <h2>{title}</h2>
                <time>1hr ago</time>
            </header>
            
            <p dangerouslySetInnerHTML={{ __html: content }}></p>
            <div className="tagContainer">
                {tags.map((tag, index) => (
                    <Tag key={index} content={tag}/>
                ))}
            </div>
        </div>
        </>
    );
}