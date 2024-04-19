import { Form, Link, useActionData, useNavigate } from "react-router-dom";
import "./login.css"
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import api from "../../client/APIClient";

export default function Login() {
    const data = useActionData();
    const navigate = useNavigate();

    //check if user is logged in already
    api.getCurrentUser().then(user => {
        //user is logged in
        navigate("/");
    }).catch(() => {
        //user is not logged in, do nothing
    });
    
    return (
        <div className="login-page" action="/login">
            <Form method="post">
                <div className="login-container">
                    <label htmlFor="email">Email</label>
                    <div className="input-container"> 
                        <MdEmail className="icon" />
                        <input type="email" name="email" placeholder="Email" required />
                    </div>

                    <label htmlFor="password">Password</label>
                    <div className="input-container">
                        <RiLockPasswordFill className="icon" />
                        <input type="password" name="password" placeholder="Password" required/>
                    </div>

                    {data && data.error && <p className="error">{data.error}</p>}
                    <input type="submit" value="LOGIN" />
                    <p>Need an account? <Link to="/sign-up">Register</Link></p>
                </div>
            </Form>
        </div>
    );
}