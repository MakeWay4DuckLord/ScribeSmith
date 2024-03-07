import { Form } from "react-router-dom";
import "./createCampaign.css";

export default function CreateCampaign() {
    return (
        <>
            <div className="create-campaign">
                <h1>CREATE CAMPAIGN</h1>
                <div className="create-box">
                    <form method="post" encType="multipart/form-data">
                        {/* name description banner */}
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" />
                        
                        <label htmlFor="description">Description:</label>
                        <input type="textarea" name="description" required />

                        <label htmlFor="banner">Banner:</label>
                        <input type="file" name="img-upload" id="img-upload-input" required />

                        {/* <button type="submit">Send</button> */}
                        <input type="submit" value="Create" />
                        
                    </form>
                </div>
            </div>
        </>
    );
}