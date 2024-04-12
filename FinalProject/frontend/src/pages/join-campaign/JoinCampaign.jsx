import { Form, useActionData } from "react-router-dom";
import "./joinCampaign.css";

//TODO: Add functionality for joining and routing
export default function JoinCampaign() {
    const data = useActionData();


    return (
        <>
            <div className="join-campaign">
                    <h1>JOIN CAMPAIGN</h1>
                    <div className="join-box">                    
                        <Form method="post" action="/join-campaign">
                            
                            <label htmlFor="code">Enter Campaign Code:</label>
                            <input type="text" name="code" maxLength={5} />
                            {data && data.error && <p className="error">{data.error}</p>}
                            <input type="submit" value="Join Campaign!" />
                        </Form>
                </div>                
            </div>
        </>
    );
}