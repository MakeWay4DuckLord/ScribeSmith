import { FaHashtag } from "react-icons/fa";
import './tag.css';

export default function Tag({content}) {
    return (
        <>
        {(content === null) ? 
            <></> 
            :
            <div className="tag-component">
                <FaHashtag className="icon"/>
                <p>{content}</p>
            </div> 
        }
       </>
    );
}