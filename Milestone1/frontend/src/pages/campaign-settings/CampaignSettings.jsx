import { Form } from "react-router-dom";
import "./campaignSettings.css";

export default function CampaignSettings() {
    return (
        <>
            <div className="campaign-settings">
                <h1>CAMPAIGN SETTINGS</h1>
                <div className="settings-box">
                    <form method="post" encType="multipart/form-data">
                        {/* name description banner */}
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" />
                        
                        <label htmlFor="description">Description:</label>
                        <textarea name="description" rows="5" required></textarea>

                        <label htmlFor="banner">Banner:</label>
                        <input type="file" name="img-upload" id="img-upload-input" required />

                        {/* <button type="submit">Send</button> */}
                        <input type="submit" value="Save" />
                        
                    </form>
                </div>
            </div>
        </>
    );
}