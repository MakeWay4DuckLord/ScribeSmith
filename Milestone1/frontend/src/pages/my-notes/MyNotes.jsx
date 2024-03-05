// import './myNotes.css'

import NoteBrowser from "../../components/NoteBrowser/NoteBrowser";


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
        <NoteBrowser title='My Notes' notes={myNotes}></NoteBrowser>

        </div>
    );
}