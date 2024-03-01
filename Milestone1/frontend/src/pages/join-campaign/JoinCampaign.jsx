import { Form } from "react-router-dom";
import "./joinCampaign.css";

//TODO: Add functionality for joining and routing
export default function JoinCampaign() {
    return (
        <>
            <div className="join-campaign">
                    <h1>JOIN CAMPAIGN</h1>
                    <div className="join-box">                    
                        <Form method="post">
                            
                            <label htmlFor="code">Enter Campaign Code:</label>
                            <input type="text" id="code" />
                            <input type="submit" value="Join Campaign!" />
                        </Form>
                </div>                
            </div>
        </>
    );
}