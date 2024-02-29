import { Form, Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import "./signup.css"

//TODO: Add form functionality and error checking
export default function SignUp() {
    return (
        <div className="sign-up-page">
            <Form method="post">
                <div className="sign-up-container">
                    <label htmlFor="name">Full Name</label>
                    <div className="input-container"> 
                        <FaUser className="icon" />
                        <input type="text" id="name" placeholder="Full Name" />
                    </div>

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

                    <label htmlFor="confirm-password">Confirm Password</label>
                    <div className="input-container">
                        <RiLockPasswordFill className="icon" />
                        <input type="password" id="confirm-password" placeholder="Confirm Password" />
                    </div>

                    <input type="submit" value="CREATE ACCOUNT" />
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </Form>
        </div>
    );
}