import Tag from "../Tag/Tag";
import TextEditor from "../TextEditor/TextEditor";
import { useEffect, useState } from "react";


export default function Note({}) {

    return (
        <div className='note'>
            <TextEditor content="<p> example data </p>"/>
        </div>
    );
}