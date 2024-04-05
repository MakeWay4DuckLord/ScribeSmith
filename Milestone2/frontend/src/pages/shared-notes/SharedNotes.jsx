// import './myNotes.css'

import NoteBrowser from "../../components/NoteBrowser/NoteBrowser";


import api from "../../client/APIClient";

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function SharedNotes() {
    const[myNotes, setNotes] = useState([]);
    const[campaignTags, setCampaignTags] = useState([]);
    const {campaignId} = useParams();
    const [error, setError] = useState("");

    useEffect(() => {
        api.getCurrentUser().then(currentUser => {
            api.getCampaign(campaignId).then(cpn => {
                const userids = [cpn.ownerId, ...cpn.userIds];
                console.log(userids)
                for(let i = 0; i < userids.length; i++) {
                    const id = userids[i];
                    console.log(id)
                    //this will be replaced with an endpoint that does filtering with sql queries in the backend
                    api.getCampaignNotesByUser(campaignId, id).then(notes => {
                        console.log("notes", notes);
                        console.log("userID, ", currentUser.userId);
                        setNotes([...myNotes, ...notes.filter(note => note.sharedWith.includes(currentUser.userId))]); 
                    }).catch(err => {
                        setError(err);
                    });
                }
            })

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
        <NoteBrowser title='Shared Notes' notes={myNotes} campaignTags={campaignTags}/>
        </div>
    );
}