import { Form } from "react-router-dom";
import "./createCampaign.css";

export default function CreateCampaign() {
    return (
        <>
            <div className="create-campaign">
                <h1>CREATE CAMPAIGN</h1>
                <div className="create-box">
                    <Form method="post">
                        {/* name description banner */}
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" />
                        
                    </Form>
                </div>
            </div>
        </>
    );
}