import "./campaignCard.css";

//TODO: route page to proper campaign page when clicked
export default function CampaignCard({name, owner, description}) {
    return (
        <>
            <div className="campaign-card">
                <h2>{name}</h2>
                <h4>GM: {owner}</h4>
                <p>{description}</p>
            </div>
        </>
    );
}