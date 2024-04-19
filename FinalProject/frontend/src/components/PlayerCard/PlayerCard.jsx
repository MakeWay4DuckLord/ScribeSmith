import "./playerCard.css"
import api from "../../client/APIClient";
import { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';

export default function PlayerCard({player}) {
    const [name, setName] = useState(null);
    const [icon, setIcon] = useState(null);

    const userId = player.userId;
    
    useEffect(() => {
        api.getUser(userId).then(user => {
            api.getUserIcon(userId).then(icon => {
                setName(`${user.first_name} ${user.last_name}`);
                setIcon(icon);
            }).catch(err => {
                console.log("error loading user icon", err);
            })
        }).catch(err => {
            console.log("error getting user", err);
        })
    }, [])
    return (
        <>
        <div className="player-card">

        <Avatar alt={`User icon for ${name}`} src={icon} />
        <h3 id="name">{name}</h3>
        </div>
    </>
    )
}