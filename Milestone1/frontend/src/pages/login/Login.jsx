import { Form, Link } from "react-router-dom";
import "./login.css"
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";


//TODO: Need functionality for logging in, right now its just styling
export default function Login() {
    return (
        <div className="login-page">
            <Form method="post">
                <div className="login-container">
                    <p className="alert">Incorrect username or password.</p>
                    <label htmlFor="email">Email</label>
                    <div className="input-container"> 
                        <MdEmail className="icon" />
                        <input type="email" id="email" placeholder="Email" />
                    </div>

                    <label htmlFor="password">Password</label>
                    <div className="input-container">
                        <RiLockPasswordFill className="icon" />
                        <input type="password" id="password" placeholder="Password" />
                    </div>
                    <input type="submit" value="LOGIN" />
                    <p>Need an account? <Link to="/sign-up">Register</Link></p>
                </div>
            </Form>
        </div>
    );
}