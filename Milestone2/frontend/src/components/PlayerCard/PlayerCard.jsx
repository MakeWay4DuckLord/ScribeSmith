import "./playerCard.css"

export default function PlayerCard({player}) {
    return (
        <>
        <div className="player-card">

        <img src={player.icon} alt={`profile picture for ${player.name}`}></img>

        {/* <label htmlFor="name">Name:</label> */}
        <h3 id="name">{player.name}</h3>
        
        {/* <label htmlFor="userId">userId:</label>
        <div id="userId">{`userId: ${player.userId}`}</div> */}
        
        </div>
    </>
    )
}