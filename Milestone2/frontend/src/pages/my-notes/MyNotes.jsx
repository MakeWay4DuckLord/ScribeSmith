// import './myNotes.css'

import NoteBrowser from "../../components/NoteBrowser/NoteBrowser";


import api from "../../client/APIClient";

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function MyNotes() {
    const[myNotes, setNotes] = useState([]);
    const[campaignTags, setCampaignTags] = useState([]);
    const {campaignId} = useParams();
    const [error, setError] = useState("");

    useEffect(() => {
        api.getCurrentUser().then(currentUser => {
            api.getCampaignNotesByUser(campaignId, currentUser.userId).then(notes => {
                setNotes(notes);
            }).catch(err => {
                setError(err);
            });

            api.getCampaign(campaignId).then(cpn => {
                setCampaignTags(cpn.tags);
            })


        }).catch(() => { //user not authenticated
            navigate("/login");
        });
    }, [campaignId]);
                

    if(error !== "") {
        return <h1>{error}</h1>
    }


    return(
        <div className='myNotes'>
        <NoteBrowser title='My Notes' notes={myNotes} campaignTags={campaignTags}/>
        </div>
    );
}