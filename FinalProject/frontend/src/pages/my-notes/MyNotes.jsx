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
    const [refresh, setRefresh] = useState(true);

    const saveCallback = () => {
        console.log("save callback");
        setRefresh(true);
    }

    useEffect(() => {
        api.getCurrentUser().then(currentUser => {
            if(refresh){
                setRefresh(false);
                api.getCampaignNotesByUser(campaignId, currentUser.userId).then(notes => {
                    setNotes(notes);
                }).catch(err => {
                    setError(err);
                });
            }

            api.getCampaign(campaignId).then(cpn => {
                setCampaignTags(cpn.tags); //this may need to change now that we are using sql
            })


        }).catch(() => { //user not authenticated
            navigate("/login");
        });
    }, [campaignId, refresh]);
                

    if(error !== "") {
        return <h1>{error}</h1>
    }


    return(
        <div className='myNotes'>
            <NoteBrowser title='My Notes' notes={myNotes} campaignTags={campaignTags} saveCallback={saveCallback}/>
        </div>
    );
}