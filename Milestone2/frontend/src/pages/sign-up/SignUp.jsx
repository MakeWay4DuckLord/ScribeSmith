import { Form, Link, useActionData } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import "./signUp.css"

//TODO: Add form functionality and error checking
export default function SignUp() {
    const data = useActionData();

    return (
        <div className="sign-up-page">
            <Form method="post" action="/sign-up">
                <div className="sign-up-container">
                    <label htmlFor="firstName">First Name</label>
                    <div className="input-container"> 
                        <FaUser className="icon" />
                        <input type="text" name="firstName" placeholder="First Name" required/>
                    </div>

                    <label htmlFor="lastName">lastName Name</label>
                    <div className="input-container"> 
                        <FaUser className="icon" />
                        <input type="text" name="lastName" placeholder="Last Name" required/>
                    </div>

                    <label htmlFor="email">Email</label>
                    <div className="input-container"> 
                        <MdEmail className="icon" />
                        <input type="email" name="email" placeholder="Email" required/>
                    </div>

                    <label htmlFor="password">Password</label>
                    <div className="input-container">
                        <RiLockPasswordFill className="icon" />
                        <input type="password" name="password" placeholder="Password" required/>
                    </div>

                    <label htmlFor="confirm-password">Confirm Password</label>
                    <div className="input-container">
                        <RiLockPasswordFill className="icon" />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" required/>
                    </div>

                    {data && data.error && <p className="error">{data.error}</p>}
                    <input type="submit" value="CREATE ACCOUNT" />                    
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </Form>
        </div>
    );
}
