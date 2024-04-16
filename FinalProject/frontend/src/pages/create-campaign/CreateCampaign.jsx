import { Form, useActionData, useNavigate } from "react-router-dom";
import { useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import "./createCampaign.css";

export default function CreateCampaign() {
    const [descrCount, setDescrCount] = useState(0);
    const data = useActionData();
    const navigate = useNavigate();

    const handleDescrChange = (e) => {
        setDescrCount(e.target.value.length);
    }

    const handleContinueClick = () => {
        navigate("/");
    }

    return (
        <>
            <div className="create-campaign">
                <h1>CREATE CAMPAIGN</h1>
                <div className="create-box">
                    <Form method="post" action="/create-campaign" encType="multipart/form-data">
                        {/* name description banner */}
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" required/>
                        
                        <label htmlFor="description">Description:</label>
                        <textarea name="description" rows="3" maxLength={300} onChange={handleDescrChange} required></textarea>
                        <p>{descrCount}/300</p>

                        <label htmlFor="banner">Banner:</label>
                        <input type="file" name="image" accept="image/*" id="img-upload-input" required />

                        {/* <button type="submit">Send</button> */}
                        {data && data.error && <p className="error">{data.error}</p>}
                        <input type="submit" value="Create" />
                        
                        {data && data.joinCode && 
                        <div className="popUp">
                            <Dialog 
                                open={true}
                                PaperProps={{
                                    style: {
                                      backgroundColor: '#c0b5cb',
                                      color: "white",
                                      textAlign: "center"
                                    },
                                  }}>
                                <DialogTitle>
                                    {"Camapign Join Code:"}
                                </DialogTitle>
                                <DialogContent>
                                <DialogContentText fontSize={36} fontWeight={"bold"}>
                                    {data.joinCode}
                                </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <button onClick={handleContinueClick}>Continue</button>
                                </DialogActions>
                            </Dialog>
                        </div>}
                    </Form>
                </div>
            </div>
        </>
    );
}