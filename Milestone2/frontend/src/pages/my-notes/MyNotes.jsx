// import './myNotes.css'

import NoteBrowser from "../../components/NoteBrowser/NoteBrowser";


import api from "../../client/APIClient";

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function MyNotes() {
    const[myNotes, setNotes] = useState([]);
    const {id} = useParams();
    const [error, setError] = useState("");

    useEffect(() => {
        api.getCurrentUser().then(currentUser => {
            api.getCampaignNotesByUser(id, currentUser.userId).then(notes => {
                setNotes(notes);
            }).catch(err => {
                setError(err);
            });
        }).catch(() => { //user not authenticated
            navigate("/login");
        });
    }, [id]);
                

    if(error !== "") {
        return <h1>{error}</h1>
    }


    return(
        <div className='myNotes'>
        <NoteBrowser title='My Notes' notes={myNotes}/>

        </div>
    );
}